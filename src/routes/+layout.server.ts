import { getCurrentTab } from '$lib/navbar_tab';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  const pathname = event.url.pathname;

  return {
    currentTab: getCurrentTab(pathname)
  };
};
