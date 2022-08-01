import { BoostService } from './boost.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { sessionMock } from '../../../tests/session-mock.spec';
import { clientMock } from '../../../tests/client-mock.spec';
import { boostContractServiceMock } from '../../mocks/modules/blockchain/contracts/boost-contract.service.mock.spec';

describe('BoostService', () => {
  let service: BoostService;
  let toasterMock = new (function() {
    this.error = jasmine.createSpy('error');
  })();

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    service = new BoostService(
      sessionMock,
      clientMock,
      boostContractServiceMock,
      toasterMock
    );
    clientMock.response = {};

    boostContractServiceMock.tx = '0xa123123';
    boostContractServiceMock.accept.calls.reset();
    boostContractServiceMock.reject.calls.reset();
    boostContractServiceMock.revoke.calls.reset();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should load boosts', fakeAsync(() => {
    service = new BoostService(
      sessionMock,
      clientMock,
      boostContractServiceMock,
      toasterMock
    );

    clientMock.response['api/v2/boost/newsfeed/'] = {
      status: 'success',
    };

    service.load('newsfeed', '');
    jasmine.clock().tick(10);

    expect(clientMock.get).toHaveBeenCalled();
    const args = clientMock.get.calls.mostRecent().args;
    expect(args[0]).toBe('api/v2/boost/newsfeed/');
    expect(args[1]).toEqual({ limit: 12, offset: '', remote: '' });
  }));

  it('should accept a usd p2p boost', fakeAsync(() => {
    const boost = {
      guid: '1234',
      handler: 'p2p',
      state: 'created',
      currency: 'usd',
    };

    const url = 'api/v2/boost/peer/1234';
    clientMock.response[url] = { status: 'success' };

    service.accept(boost);
    jasmine.clock().tick(10);
    expect(clientMock.put).toHaveBeenCalled();
    expect(clientMock.put.calls.mostRecent().args[0]).toBe(url);
    expect(boostContractServiceMock.accept).not.toHaveBeenCalled();
  }));

  it('should accept a p2p boost', fakeAsync(() => {
    const boost = {
      guid: '1234',
      handler: 'p2p',
      state: 'created',
      currency: 'tokens',
    };

    const url = 'api/v2/boost/peer/1234';
    clientMock.response[url] = { status: 'success' };

    service.accept(boost);
    jasmine.clock().tick(10);
    expect(clientMock.put).toHaveBeenCalled();
    expect(clientMock.put.calls.mostRecent().args[0]).toBe(url);
    expect(boostContractServiceMock.accept).toHaveBeenCalled();
    expect(boostContractServiceMock.accept.calls.mostRecent().args[0]).toBe(
      '1234'
    );
  }));

  it('should reject a p2p boost', fakeAsync(() => {
    const boost = {
      guid: '1234',
      handler: 'p2p',
      state: 'created',
      currency: 'tokens',
    };

    const url = 'api/v2/boost/peer/1234';
    clientMock.response[url] = { status: 'success' };

    service.reject(boost);
    tick(500);
    // tick(500);

    expect(clientMock.delete).toHaveBeenCalled();
    expect(clientMock.delete.calls.mostRecent().args[0]).toBe(url);
    expect(boostContractServiceMock.reject).toHaveBeenCalled();
    expect(boostContractServiceMock.reject.calls.mostRecent().args[0]).toBe(
      '1234'
    );
  }));

  it('should reject a usd p2p boost', fakeAsync(() => {
    const boost = {
      guid: '1234',
      handler: 'p2p',
      state: 'created',
      currency: 'usd',
    };

    const url = 'api/v2/boost/peer/1234';
    clientMock.response[url] = { status: 'success' };

    service.reject(boost);
    jasmine.clock().tick(10);
    expect(clientMock.delete).toHaveBeenCalled();
    expect(clientMock.delete.calls.mostRecent().args[0]).toBe(url);
    expect(boostContractServiceMock.reject).not.toHaveBeenCalled();
  }));

  it('should revoke a non p2p usd boost', fakeAsync(() => {
    const boost = {
      guid: '1234',
      handler: 'newsfeed',
      state: 'created',
      currency: 'usd',
      transactionId: 'oc',
    };

    const url = 'api/v2/boost/newsfeed/1234/revoke';
    clientMock.response[url] = { status: 'success' };

    service.revoke(boost);
    jasmine.clock().tick(10);
    expect(clientMock.delete).toHaveBeenCalled();
    expect(clientMock.delete.calls.mostRecent().args[0]).toBe(url);
    expect(boostContractServiceMock.revoke).not.toHaveBeenCalled();
  }));

  it('should revoke a non p2p boost', fakeAsync(() => {
    const boost = {
      guid: '1234',
      handler: 'newsfeed',
      state: 'created',
      currency: 'tokens',
      transactionId: '0x',
    };

    const url = 'api/v2/boost/newsfeed/1234/revoke';
    clientMock.response[url] = { status: 'success' };

    service.revoke(boost);
    jasmine.clock().tick(10);
    expect(clientMock.delete).toHaveBeenCalled();
    expect(clientMock.delete.calls.mostRecent().args[0]).toBe(url);
    expect(boostContractServiceMock.revoke).toHaveBeenCalled();
    expect(boostContractServiceMock.revoke.calls.mostRecent().args[0]).toBe(
      '1234'
    );
  }));

  it('should revoke a p2p usd boost', fakeAsync(() => {
    const boost = {
      guid: '1234',
      handler: 'p2p',
      state: 'created',
      currency: 'usd',
      transactionId: 'oc',
    };

    const url = 'api/v2/boost/peer/1234/revoke';
    clientMock.response[url] = { status: 'success' };

    service.revoke(boost);
    jasmine.clock().tick(10);
    expect(clientMock.delete).toHaveBeenCalled();
    expect(clientMock.delete.calls.mostRecent().args[0]).toBe(url);
    expect(boostContractServiceMock.revoke).not.toHaveBeenCalled();
  }));

  it('should revoke a p2p boost', fakeAsync(() => {
    const boost = {
      guid: '1234',
      handler: 'p2p',
      state: 'created',
      currency: 'tokens',
      transactionId: '0x',
    };

    const url = 'api/v2/boost/peer/1234/revoke';
    clientMock.response[url] = { status: 'success' };

    service.revoke(boost);
    jasmine.clock().tick(10);
    expect(clientMock.delete).toHaveBeenCalled();
    expect(clientMock.delete.calls.mostRecent().args[0]).toBe(url);
    expect(boostContractServiceMock.revoke).toHaveBeenCalled();
    expect(boostContractServiceMock.revoke.calls.mostRecent().args[0]).toBe(
      '1234'
    );
  }));

  it('should be able to differentiate onchain and offchain transactions', fakeAsync(() => {
    const onChain = service.isOnChain({ transactionId: '0x0000000000' });
    const offChain = service.isOnChain({ transactionId: 'oc' });

    jasmine.clock().tick(10);
    expect(onChain).toBeTruthy();
    expect(offChain).toBeFalsy();
  }));
});
