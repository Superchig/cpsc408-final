import { writable } from 'svelte/store';

export enum NavbarTab {
  Transactions = 1,
  Accounts
}

export const navbarTab = writable(NavbarTab.Transactions);
