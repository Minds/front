import { Injectable } from '@angular/core';
import {
  Campaign,
  CampaignDeliveryStatus,
  CampaignPayment,
  CampaignPreview,
  CampaignType,
} from './campaigns.type';
import { Client } from '../../../services/api/client';
import isInt from '../../../helpers/is-int';
import getGuidFromUrn from '../../../helpers/get-guid-from-urn';

export type CampaignsServiceListOptions = {
  limit?: number;
  offset?: string;
};

@Injectable()
export class CampaignsService {
  constructor(protected client: Client) {}

  async list(
    opts: CampaignsServiceListOptions = {}
  ): Promise<{ campaigns: Array<Campaign>; 'load-next'?: string }> {
    const queryString = {
      limit: opts.limit || 12,
      offset: opts.offset || '',
    };

    return (await this.client.get(
      `api/v2/boost/campaigns`,
      queryString
    )) as any;
  }

  async get(urn: string): Promise<Campaign> {
    const campaigns: Campaign[] = ((await this.client.get(
      `api/v2/boost/campaigns/${urn}`
    )) as any).campaigns;

    if (typeof campaigns[0] === 'undefined') {
      return null;
    }

    return {
      ...campaigns[0],
      original_campaign: JSON.parse(JSON.stringify(campaigns[0])),
    };
  }

  isEditable(campaign: Campaign): boolean {
    return (
      (['pending', 'created', 'approved'] as CampaignDeliveryStatus[]).indexOf(
        campaign.delivery_status
      ) > -1
    );
  }

  validate(campaign: Campaign): boolean {
    // TODO: Validate data ranges, etc

    if (!campaign.name) {
      throw new Error('You must include a name');
    }

    if (!campaign.start) {
      throw new Error('Start date not defined');
    }

    if (!campaign.end) {
      throw new Error('End date not defined');
    }

    // start date should be before end date
    if (campaign.start >= campaign.end) {
      throw new Error('End date should be a after the start date');
    }

    // if we're editing, end date can't be modified to an earlier date
    if (
      campaign.delivery_status &&
      campaign.delivery_status == 'created' &&
      campaign.original_campaign &&
      campaign.end < campaign.original_campaign.end
    ) {
      throw new Error(
        'You can only change End date to a later one from the original'
      );
    }

    // budget should be bigger than zero integer
    if (!campaign.budget || campaign.budget === 0 || !isInt(campaign.budget)) {
      throw new Error('Budget must be a bigger-than-zero integer');
    }

    if (!campaign.entity_urns || campaign.entity_urns.length == 0) {
      throw new Error('You must include something to boost');
    }

    return campaign && campaign && !!campaign.type;
  }

  async preview(campaign: Campaign): Promise<CampaignPreview | false> {
    if (
      !campaign.type ||
      !campaign.entity_urns ||
      !campaign.entity_urns.length ||
      !campaign.budget ||
      !campaign.budget_type
    ) {
      return false;
    }

    return ((await this.client.post(
      `api/v2/boost/campaigns/preview`,
      campaign
    )) as any).preview;
  }

  async prepare(
    campaign: Campaign
  ): Promise<{ checksum: string; guid: string }> {
    if (campaign.entity_urns.length !== 1) {
      throw new Error('Campaigns without a single entity are unsupported');
    }

    const entityGuid = getGuidFromUrn(campaign.entity_urns[0]);

    const { guid, checksum } = (await this.client.get(
      `api/v2/boost/prepare/${entityGuid}`
    )) as any;

    if (!guid) {
      throw new Error('Cannot generate GUID');
    }

    return { guid, checksum };
  }

  async create(
    campaign: Campaign,
    payment?: CampaignPayment
  ): Promise<Campaign> {
    if (!this.validate(campaign)) {
      throw new Error('Campaign is invalid');
    }

    const data = { ...campaign };

    if (payment) {
      data['payment'] = payment;
    }

    return ((await this.client.post(`api/v2/boost/campaigns`, data)) as any)
      .campaign;
  }

  async update(
    campaign: Campaign,
    payment?: CampaignPayment
  ): Promise<Campaign> {
    if (!campaign.urn) {
      throw new Error('Missing campaign URN');
    }

    if (!this.validate(campaign)) {
      throw new Error('Campaign is invalid');
    }

    const data = { ...campaign };

    if (payment) {
      data['payment'] = payment;
    }

    return ((await this.client.post(
      `api/v2/boost/campaigns/${campaign.urn}`,
      data
    )) as any).campaign;
  }

  async cancel(campaign: Campaign): Promise<Campaign> {
    if (!campaign.urn) {
      throw new Error('Missing campaign URN');
    }

    return ((await this.client.delete(
      `api/v2/boost/campaigns/${campaign.urn}`
    )) as any).campaign;
  }

  getTypes(): Array<{ id: CampaignType; label: string; disabled?: boolean }> {
    return [
      {
        id: 'newsfeed',
        label: 'Newsfeed',
      },
      {
        id: 'content',
        label: 'Sidebar',
      },
      {
        id: 'banner',
        label: 'Banner',
        disabled: true,
      },
      {
        id: 'video',
        label: 'Video',
        disabled: true,
      },
    ];
  }

  getDeliveryStatuses(): Array<{ id: CampaignDeliveryStatus; label: string }> {
    return [
      {
        id: 'pending',
        label: 'Pending',
      },
      {
        id: 'created',
        label: 'Created',
      },
      {
        id: 'failed',
        label: 'Failed',
      },
      {
        id: 'approved',
        label: 'Active',
      },
      {
        id: 'rejected',
        label: 'Rejected',
      },
      {
        id: 'revoked',
        label: 'Cancelled',
      },
      {
        id: 'completed',
        label: 'Completed',
      },
    ];
  }
}
