'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/server/db/prisma';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Enter a valid email address.').trim().toLowerCase(),
  message: z.string().trim().min(10, 'Message must be at least 10 characters.'),
});

export async function contactAction(formData: FormData) {
  const raw = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    message: String(formData.get('message') ?? ''),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const error = parsed.error.issues[0]?.message ?? 'Please check your details.';
    const params = new URLSearchParams({ error, name: raw.name, email: raw.email, message: raw.message });
    redirect(`/contact?${params.toString()}`);
  }

  const { name, email, message } = parsed.data;

  // Upsert so the same email can re-submit and update their message
  await prisma.contactSubmission.upsert({
    where: { email },
    update: { name, message },
    create: { email, name, message },
  });

  redirect('/contact?success=true');
}
