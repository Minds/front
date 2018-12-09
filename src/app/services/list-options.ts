export const LICENSES : Array<any> = [
  {value:'all-rights-reserved', text:'All rights reserved'},
  {value:'attribution-cc', text:'Attribution CC BY'},
  {value:'attribution-sharealike-cc', text:'Attribution-ShareAlike BY-SA'},
  {value:'attribution-noderivs-cc', text:'Attribution-NoDerivs CC BY-ND'},
  {value:'attribution-noncommercial-cc', text:'Attribution-NonCommerical CC BY-NC'},
  {value:'attribution-noncommercial-sharealike-cc', text:'Attribution-NonCommerical-ShareAlike CC BY-NC-SA'},
  {value:'attribution-noncommercial-noderivs-cc', text:'Attribution-NonCommerical-NoDerivs CC BY-NC-ND'},
  {value:'publicdomaincco', text:'Public Domain CCO "No Rights Reserved'},
  {value:'gnuv3', text:'GNU v3 General Public License'},
  {value:'gnuv1.3', text:'GNU v1.3 Free Documentation License'},
  {value:'gnu-lgpl', text:'GNU Lesser General Public License'},
  {value:'gnu-affero', text: 'GNU Affero General Public License'},
  {value:'apache-v1', text:'Apache License, Version 1.0'},
  {value:'apache-v1.1', text:'Apache License, Version 1.1'},
  {value:'apache-v2', text:'Apache License, Version 2.0'},
  {value:'mozillapublic', text:'Mozilla Public License'},
  {value:'bsd', text:'BSD License'}
];

export const ACCESS : Array<any> = [
  {value: 0, text: 'Unlisted'},
  {value: 1, text: 'Loggedin'},
  {value: 2, text: 'Public'}
];

export const REASONS : Array<any> = [
  { value: 1 , label: 'Illegal' },
  { value: 2, label: 'Should be marked as explicit' },
  { value: 3, label: 'Encourages or incites violence' },
  { value: 4, label: 'Threatens, harasses, bullies or encourages others to do so' },
  { value: 5, label: 'Personal and confidential information' },
  { value: 6, label: 'Maliciously targets users (@name, links, images or videos)' },
  { value: 7, label: 'Impersonates someone in a misleading or deceptive manner' },
  { value: 8, label: 'Spam' },
  { value: 10, label: 'This infringes my copyright' },
  { value: 11, label: 'Another reason' }
];

export const READABLE_REASONS : Array<any> = [
  { value: 1 , label: 'is illegal' },
  { value: 2, label: 'Should be marked as explicit' },
  { value: 3, label: 'Encourages or incites violence' },
  { value: 4, label: 'Threatens, harasses, bullies or encourages others to do so' },
  { value: 5, label: 'contains personal and confidential info' },
  { value: 6, label: 'Maliciously targets users (@name, links, images or videos)' },
  { value: 7, label: 'Impersonates someone in a misleading or deceptive manner' },
  { value: 8, label: 'is spam' },
  { value: 10, label: 'is a copyright infringement' },
  { value: 11, label: 'Another reason' }
];

export const REPORT_ACTIONS = {
  'explicit': 'Marked as Explicit',
  'spam': 'Marked as Spam',
  'delete': 'Deleted'
};
