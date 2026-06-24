export type Member = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

export type Team = {
  id: string;
  name: string;
  members: Member[];
  createdAt: Date;
};

const mockMembers: Member[] = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    role: "Technicien",
  },
  {
    id: "2",
    name: "Marie Martin",
    email: "marie.martin@example.com",
    role: "Chef d'équipe",
  },
  {
    id: "3",
    name: "Pierre Durand",
    email: "pierre.durand@example.com",
    role: "Technicien",
  },
  {
    id: "4",
    name: "Sophie Lefebvre",
    email: "sophie.lefebvre@example.com",
    role: "Ingénieur",
  },
  {
    id: "5",
    name: "Luc Bernard",
    email: "luc.bernard@example.com",
    role: "Technicien",
  },
  {
    id: "6",
    name: "Isabelle Moreau",
    email: "isabelle.moreau@example.com",
    role: "Chef d'équipe",
  },
  {
    id: "7",
    name: "Thomas Petit",
    email: "thomas.petit@example.com",
    role: "Technicien",
  },
  {
    id: "8",
    name: "Camille Roux",
    email: "camille.roux@example.com",
    role: "Ingénieur",
  },
];

// Simule un appel API
export const fetchMembers = (): Promise<Member[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMembers);
    }, 300); // Simule 300ms de latency
  });
};
