import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { accountsPath } from '$lib/routes';
import { prefetchRoutes } from '$app/navigation';

export const load: PageServerLoad = async ({ params }) => {
    throw redirect(301, accountsPath());
};
