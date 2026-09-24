// Hand-written mirrors of the backend Pydantic models — keep in sync with backend/server.py.
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  pincode: string;
  role: string;
}

export interface PincodeCheck {
  pincode: string;
  serviceable: boolean;
  hub: string | null;
  city: string | null;
  eta_days: number | null;
  message: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  cover_url: string;
  pages: number;
  synopsis: string;
  copies_total: number;
  copies_available: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  amount: number;
  status: string;
  start_date: string;
  end_date: string;
  current_cycle: number;
  books_rented_total: number;
  payment_method: string;
}

export interface Rental {
  id: string;
  user_id: string;
  subscription_id: string;
  cycle: number;
  book_ids: string[];
  books: Book[];
  status: string;
  ordered_at: string;
  due_date: string;
  returned_at: string | null;
}

export interface AppNotification {
  id: string;
  kind: string;
  title: string;
  body: string;
  channel: string;
  created_at: string;
}
