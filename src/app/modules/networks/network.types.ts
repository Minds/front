/**
 * A network in the networks list
 */
//ojm change this when we know data model
export type NetworksListItem = {
  name?: string;
  id?: string; // for 'go to network' button)? ojm
  iconUrl?: string; // ojm or favicon?
};

export type NetworksListGetParams = {
  limit?: number;
  offset?: number;
};
