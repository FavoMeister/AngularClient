export interface CarModel {
  id: number;
  user_id: number;
  title: string;
  description: string;
  image?: string | null;  // Más flexible
  price: number;
  status: boolean;
  created_at?: string;
  updated_at?: string;
  // Si Laravel incluye relaciones (opcional)
  user?: {
    id: number;
    name: string;
    email: string;
  };
}
