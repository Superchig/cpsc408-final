import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { transactionsPath } from '$lib/routes';

export const load: PageServerLoad = async ({ params }) => {
    throw redirect(301, transactionsPath());
};
