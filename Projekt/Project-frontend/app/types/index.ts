export interface IUser {
  id: number;
  username: string;
  email: string;
  role: string;
  accessToken: string;
}

export interface IEdition {
  editionid: number;
  isbn13: string;
  workid: number;
  title: string;
  authors: string;
  subjects: string | null;
  publisher: string;
  publicationdate: string;
  availability: "Available" | "OnLoan" | "Reserved" | "Damaged";
  currentUserHasLoan?: boolean;
  currentUserHasReservation?: boolean;
}

export interface IMyLoan {
  loanid: number;
  loandate: string;
  duedate: string;
  edition: {
    editionid: number;
    work: {
      title: string;
    };
  };
}

export interface IAllLoan {
  loanid: number;
  loandate: string;
  duedate: string;
  returndate: string | null;
  user: {
    username: string;
  };
  edition: {
    editionid: number;
    work: {
      title: string;
    };
  };
}

export interface IReservation {
    reservationid: number;
    reservationdate: string;
    status: string;
    offer_expires_at: string | null;
    work: {
        title: string;
    }
}

export interface IAdminViewUser {
  userid: number;
  username: string;
  email: string;
  role: {
    roleid: number;
    rolename: string;
  };
}

export interface IOverdueLoan {
  loanid: number;
  username: string;
  email: string;
  title: string;
  duedate: string;
  days_overdue: number;
}

export interface IAllLoan {
  loanid: number;
  loandate: string;
  duedate: string;
  returndate: string | null;
  user: {
    username: string;
  };
  edition: {
    editionid: number;
    work: {
      title: string;
    };
  };
}

export interface IAllReservation {
  reservationid: number;
  reservationdate: string;
  status: string;
  user: {
    username: string;
  };
  work: {
    title: string;
  };
}
