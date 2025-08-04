import { Request, Response } from 'express';

interface Gig {
  id: string;
  title: string;
  payoutLKR: number;
  skills: string[];
}

const mockGigs: Gig[] = [
  {
    id: 'g1',
    title: 'Figma landing revamp',
    payoutLKR: 3000,
    skills: ['Figma']
  },
  {
    id: 'g2', 
    title: 'React component library',
    payoutLKR: 5000,
    skills: ['React']
  }
];

export function getGigs(req: Request, res: Response): void {
  res.status(200).json({
    gigs: mockGigs
  });
}