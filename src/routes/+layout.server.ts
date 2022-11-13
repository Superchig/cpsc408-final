import { accountsPath } from '$lib/routes';
import { NavbarTab } from '$lib/navbar_tab';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  const pathname = event.url.pathname;

  let currentTab = NavbarTab.Transactions;

  if (pathname.startsWith(accountsPath())) {
    currentTab = NavbarTab.Accounts;
  }

  return {
    currentTab: currentTab
  };
};
