import { Injectable } from '@angular/core';
import { Campaign, CampaignDeliveryStatus, CampaignType } from './campaigns.type';
import { Client } from '../../../services/api/client';

export type CampaignsServiceListOptions = {
  limit?: number;
  offset?: string;
}

@Injectable()
export class CampaignsService {

  constructor(
    protected client: Client,
  ) {
  }

  async list(opts: CampaignsServiceListOptions = {}): Promise<{ campaigns: Array<Campaign>, 'load-next'?: string }> {
    const queryString = {
      limit: opts.limit || 12,
      offset: opts.offset || '',
    };

    return await this.client.get(`api/v2/boost/campaigns`, queryString) as any;
  }

  async get(urn: string): Promise<Campaign> {
    const campaigns: Campaign[] = (await this.client.get(`api/v2/boost/campaigns/${urn}`) as any).campaigns;

    if (typeof campaigns[0] === 'undefined') {
      return null;
    }

    return campaigns[0];
  }

  validate(campaign: Campaign): boolean {
    // TODO: Validate data ranges, etc

    return campaign &&
      campaign &&
      campaign.name &&
      campaign.type &&
      campaign.budget &&
      campaign.budget > 0 &&
      campaign.entity_urns &&
      campaign.entity_urns.length &&
      campaign.start &&
      campaign.end &&
      campaign.start <= campaign.end;
  }

  async create(campaign: Campaign): Promise<Campaign> {
    if (!this.validate(campaign)) {
      throw new Error('Campaign is invalid');
    }

    return (await this.client.post(`api/v2/boost/campaigns`, campaign) as any).campaign;
  }

  async update(campaign: Campaign): Promise<Campaign> {
    if (!campaign.urn) {
      throw new Error('Missing campaign URN');
    }

    if (!this.validate(campaign)) {
      throw new Error('Campaign is invalid');
    }

    return (await this.client.post(`api/v2/boost/campaigns/${campaign.urn}`, campaign) as any).campaign;
  }

  getTypes(): Array<{ id: CampaignType, label: string, disabled?: boolean }> {
    return [
      {
        id: 'newsfeed',
        label: 'Newsfeed'
      },
      {
        id: 'content',
        label: 'Sidebar'
      },
      {
        id: 'banner',
        label: 'Banner',
        disabled: true
      },
      {
        id: 'video',
        label: 'Video',
        disabled: true
      }
    ];
  }

  getDeliveryStatuses(): Array<{ id: CampaignDeliveryStatus, label: string }> {
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
        label: 'Revoked',
      },
      {
        id: 'completed',
        label: 'Completed',
      },
    ];
  }
}
