type serviceStatus = "Pending" | "Approved" | "Rejected";

export interface ServiceType {
  id: string;
  title: string;
  sellerName: string;
  status: serviceStatus;
  createdAt: string | Date;
}

export const services: ServiceType[] = [
  {
    id: "1234",
    title: "CV writing",
    sellerName: "John doe",
    status: "Pending",
    createdAt: "12th May 2025",
  },
  {
    id: "1235",
    title: "3D Logo animation",
    sellerName: "John doe",
    status: "Approved",
    createdAt: "12th May 2025",
  },
  {
    id: "1236",
    title: "Graphics Design",
    sellerName: "John pele",
    status: "Rejected",
    createdAt: "12th May 2025",
  },
  {
    id: "1237",
    title: "Remote Interior Design",
    sellerName: "John doe",
    status: "Rejected",
    createdAt: "14th May 2025",
  },
  {
    id: "1238",
    title: "CV writing",
    sellerName: "Peter",
    status: "Approved",
    createdAt: "12th May 2025",
  },
  {
    id: "12312",
    title: "CV writing",
    sellerName: "Peter",
    status: "Pending",
    createdAt: "12th May 2025",
  },
  {
    id: "12315",
    title: "CV writing",
    sellerName: "Peter",
    status: "Approved",
    createdAt: "12th May 2025",
  },
];
