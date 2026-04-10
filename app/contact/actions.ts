'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/server/db/prisma';
import { queueAnalyticsEvent } from '@/lib/server/analytics/event-cookie';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Enter a valid email address.').trim().toLowerCase(),
  topic: z.string().trim().optional(),
  message: z.string().trim().min(10, 'Message must be at least 10 characters.'),
});

export async function contactAction(formData: FormData) {
  const raw = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    topic: String(formData.get('topic') ?? ''),
    message: String(formData.get('message') ?? ''),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const error = parsed.error.issues[0]?.message ?? 'Please check your details.';
    const params = new URLSearchParams({ error, name: raw.name, email: raw.email, topic: raw.topic, message: raw.message });
    redirect(`/contact?${params.toString()}`);
  }

  const { name, email, topic, message } = parsed.data;
  const fullMessage = topic ? `[${topic}]\n\n${message}` : message;

  await prisma.contactSubmission.upsert({
    where: { email },
    update: { name, message: fullMessage },
    create: { email, name, message: fullMessage },
  });

  await queueAnalyticsEvent({ name: 'contact_form_submitted', params: { topic: topic || 'general' } });
  redirect('/contact?success=true');
}
