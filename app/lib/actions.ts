'use server';
//⤴ Todo lo que se ejecute aca sera en el servidor

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Schema para validar que los datos de invoices cumplan cierta estructura
const invoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), //coerce: transforma al amount a number
  date: z.string(),
  status: z.enum(['pending', 'paid']),
});
// Elementos a omitir o no considerar
const createInvoiceFromSchema = invoiceSchema.omit({
  id: true,
  date: true,
});
const updateInvoiceFromSchema = invoiceSchema.omit({
  id: true,
  date: true,
});

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = createInvoiceFromSchema.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100; // transformamos para evitar errores de redondeo
  const date = new Date().toISOString().split('T')[0];
  // const [date] = new Date().toISOString().split('T'); // Otra forma de acceder a la primera posición

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    throw new Error('Failed to Create Invoice');
    return { message: 'Database Error: Failed to Create Invoice.' };
  }
  // Realiza una recarga de invoices ya que se agrego una nueva
  revalidatePath('/dashboard/invoices');
  // Volvemos a la pagina de invoices
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = updateInvoiceFromSchema.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    throw new Error('Failed to Update Invoice');
    return { message: 'Database Error: Failed to Update Invoice.'}
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`
      DELETE FROM invoices WHERE id = ${id}
    `;
  } catch (error) {
    throw new Error('Failed to Delete Invoice');
    return {
      message: 'Database Error: Failed to Delete Invoice.'
    }
  }
  revalidatePath('/dashboard/invoices');
}
