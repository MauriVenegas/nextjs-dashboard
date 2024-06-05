'use server';
//⤴ Todo lo que se ejecute aca sere en el servidor

import { z } from 'zod'
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const createInvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  date: z.string(),
  status: z.enum(['pending', 'paid'])
})

const createInvoiceFromSchema = createInvoiceSchema.omit({
  id: true,
  date: true
})

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = createInvoiceFromSchema.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100 // transformamos para evitar errores de redondeo
  const date = new Date().toISOString().split('T')[0];
  // const [date] = new Date().toISOString().split('T'); // Otra forma de acceder a la primera posición

  await sql `
  INSERT INTO invoices (customer_id, amount, status, date)
  VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `
  // Realiza una recarga de invoices ya que se agrego una nueva
  revalidatePath('/dashboard/invoices');
  // Volvemos a la pagina de invoices
  redirect('/dashboard/invoices');
}