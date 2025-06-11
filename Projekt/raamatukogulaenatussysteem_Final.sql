CREATE SCHEMA IF NOT EXISTS libraryapp;


CREATE TABLE IF NOT EXISTS libraryapp.roles (
    roleid SERIAL PRIMARY KEY,
    rolename VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS libraryapp.users (
    userid SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    passwordhash VARCHAR(255) NOT NULL,
    roleid INT NOT NULL REFERENCES libraryapp.roles(roleid),
    createdat TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS libraryapp.authors (
    authorid SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    createdat TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS libraryapp.subjects (
    subjectid SERIAL PRIMARY KEY,
    subjectname VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS libraryapp.works (
    workid SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    createdat TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS libraryapp.editions (
    editionid SERIAL PRIMARY KEY,
    workid INT NOT NULL REFERENCES libraryapp.works(workid) ON DELETE CASCADE,
    isbn13 VARCHAR(13) NULL UNIQUE,
    publisher VARCHAR(255) NULL,
    publicationdate DATE NULL,
    availability VARCHAR(50) NOT NULL DEFAULT 'Available' CHECK (availability IN ('Available', 'OnLoan', 'Reserved', 'Damaged'))
);

CREATE TABLE IF NOT EXISTS libraryapp.loans (
    loanid SERIAL PRIMARY KEY,
    userid INT NOT NULL REFERENCES libraryapp.users(userid),
    editionid INT NOT NULL REFERENCES libraryapp.editions(editionid),
    loandate TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    duedate TIMESTAMPTZ NOT NULL,
    returndate TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS libraryapp.workauthors (
    workid INT NOT NULL REFERENCES libraryapp.works(workid) ON DELETE CASCADE,
    authorid INT NOT NULL REFERENCES libraryapp.authors(authorid) ON DELETE CASCADE,
    PRIMARY KEY (workid, authorid)
);

CREATE TABLE IF NOT EXISTS libraryapp.worksubjects (
    workid INT NOT NULL REFERENCES libraryapp.works(workid) ON DELETE CASCADE,
    subjectid INT NOT NULL REFERENCES libraryapp.subjects(subjectid) ON DELETE CASCADE,
    PRIMARY KEY (workid, subjectid)
);

CREATE TABLE IF NOT EXISTS libraryapp.auditlog (
    logid SERIAL PRIMARY KEY,
    logtimestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actiontype VARCHAR(100) NOT NULL,
    logdetails TEXT NOT NULL
);


INSERT INTO libraryapp.roles (rolename) VALUES ('Lugeja'), ('Töötaja'), ('Admin') ON CONFLICT (rolename) DO NOTHING;



CREATE OR REPLACE VIEW libraryapp.vw_detailed_editions AS
SELECT
    e.editionid,
    e.isbn13,
    w.workid,
    w.title,
    STRING_AGG(DISTINCT a.name, ', ') AS authors,
    e.publisher,
    e.publicationdate,
    e.availability
FROM
    libraryapp.editions e
JOIN
    libraryapp.works w ON e.workid = w.workid
LEFT JOIN
    libraryapp.workauthors wa ON w.workid = wa.workid
LEFT JOIN
    libraryapp.authors a ON wa.authorid = a.authorid
GROUP BY
    e.editionid, w.workid;

CREATE OR REPLACE VIEW libraryapp.vw_overdue_loans AS
SELECT
    l.loanid,
    u.userid,
    u.username,
    u.email,
    w.title,
    e.isbn13,
    l.duedate,
    DATE_PART('day', CURRENT_TIMESTAMP - l.duedate) AS days_overdue
FROM
    libraryapp.loans l
JOIN
    libraryapp.users u ON l.userid = u.userid
JOIN
    libraryapp.editions e ON l.editionid = e.editionid
JOIN
    libraryapp.works w ON e.workid = w.workid
WHERE
    l.returndate IS NULL AND l.duedate < CURRENT_TIMESTAMP;

CREATE OR REPLACE PROCEDURE libraryapp.sp_processnewloan(p_userid INT, p_editionid INT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM libraryapp.editions WHERE editionid = p_editionid AND availability = 'Available') THEN
        RAISE EXCEPTION 'See väljaanne pole laenutamiseks saadaval.';
    END IF;

    UPDATE libraryapp.editions SET availability = 'OnLoan' WHERE editionid = p_editionid;
    INSERT INTO libraryapp.loans (userid, editionid, duedate) VALUES (p_userid, p_editionid, CURRENT_TIMESTAMP + INTERVAL '21 day');
END;
$$;

CREATE OR REPLACE PROCEDURE libraryapp.sp_processreturn(p_editionid INT)
LANGUAGE plpgsql
AS $$
DECLARE
    v_loanid INT;
BEGIN
    SELECT loanid INTO v_loanid FROM libraryapp.loans WHERE editionid = p_editionid AND returndate IS NULL;
    IF v_loanid IS NULL THEN
        RAISE EXCEPTION 'Sellel väljaandel puudub aktiivne laenutus.';
    END IF;

    UPDATE libraryapp.editions SET availability = 'Available' WHERE editionid = p_editionid;
    UPDATE libraryapp.loans SET returndate = CURRENT_TIMESTAMP WHERE loanid = v_loanid;
END;
$$;



CREATE OR REPLACE FUNCTION libraryapp.fn_lognewloan()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO libraryapp.auditlog (actiontype, logdetails)
    VALUES ('New Loan', format('User with ID %s loaned Edition with ID %s.', NEW.userid, NEW.editionid));
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_lognewloan ON libraryapp.loans;
CREATE TRIGGER trg_lognewloan
AFTER INSERT ON libraryapp.loans
FOR EACH ROW
EXECUTE FUNCTION libraryapp.fn_lognewloan();
