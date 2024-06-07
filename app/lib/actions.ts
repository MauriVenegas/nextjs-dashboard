'use server';
//⤴ Todo lo que se ejecute aca sera en el servidor

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// Schema para validar que los datos de invoices cumplan cierta estructura
const invoiceSchema = z.object({
  id: z.string(),
  customerId: z.string({ invalid_type_error: 'Please select a customer.' }),
  //coerce: transforma el amount a number, gt: alias .min(0)
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  date: z.string(),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
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
// This is temporary until @types/react-dom is updated
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// prevState: contiene el estado pasado desde el hook useFormState en 'create-forms.tsx'. No se usara en la acción de este ejemplo, pero es un accesorio obligatorio.
export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = createInvoiceFromSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100; // transformamos para evitar errores de redondeo
  const date = new Date().toISOString().split('T')[0];
  // const [date] = new Date().toISOString().split('T'); // Otra forma de acceder a la primera posición

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // throw new Error('Failed to Create Invoice');
    return { message: 'Database Error: Failed to Create Invoice.' };
  }
  // Realiza una recarga de invoices ya que se agrego una nueva
  revalidatePath('/dashboard/invoices');
  // Volvemos a la pagina de invoices
  redirect('/dashboard/invoices');
}

// prevState: contiene el estado pasado desde el hook useFormState en 'edit-forms.tsx'. No se usara en la acción de este ejemplo, pero es un accesorio obligatorio.
export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validatedFields = updateInvoiceFromSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    // throw new Error('Failed to Update Invoice');
    return { message: 'Database Error: Failed to Update Invoice.' };
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
      message: 'Database Error: Failed to Delete Invoice.',
    };
  }
  revalidatePath('/dashboard/invoices');
}

// prevState: contiene el estado pasado desde el hook useFormState en 'app/ui/login-form.tsx'. No se usara en la acción de este ejemplo, pero es un accesorio obligatorio.
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
