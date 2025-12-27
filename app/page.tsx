import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to /pulse as the main page
  redirect('/pulse');
}
