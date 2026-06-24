export type Employe = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
};

/* ───────────── Mock data ───────────── */

export const mockEmployes: Employe[] = [
  {
    id: "emp-1",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@mail.com",
    phone: "0601020304",
  },
  {
    id: "emp-2",
    firstName: "Marie",
    lastName: "Martin",
    email: "marie.martin@mail.com",
  },
  {
    id: "emp-3",
    firstName: "Lucas",
    lastName: "Bernard",
    phone: "0611223344",
  },
];
