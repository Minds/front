interface Menu {
  header: MenuLink;
  links?: MenuLink[];
  expanded?: boolean;
}
export { Menu };

interface MenuLink {
  id: string;
  label: string;
  permissions?: string[];
  permissionGranted?: boolean;
  path?: string;
  newWindow?: boolean;
}
export { MenuLink };
