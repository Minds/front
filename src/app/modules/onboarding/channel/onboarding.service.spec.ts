// import { ChannelOnboardingService } from "./onboarding.service";
// import { clientMock } from "../../../../tests/client-mock.spec";
// import { fakeAsync } from "@angular/core/testing";
//
// describe('ChannelOnboardingService', () => {
//
//   let service: ChannelOnboardingService;
//
//   beforeEach(() => {
//     jasmine.clock().uninstall();
//     jasmine.clock().install();
//     service = new ChannelOnboardingService(clientMock);
//     clientMock.response = {};
//   });
//
//   afterEach(() => {
//     jasmine.clock().uninstall();
//   });
//
//   it('should be instantiated', () => {
//     expect(service).toBeTruthy();
//   });
//
//   it('should check progress', fakeAsync(() => {
//     const url = 'api/v2/onboarding/progress';
//     clientMock.response[url] = {
//       status: 'success'
//     };
//
//     service.checkProgress();
//     jasmine.clock().tick(10);
//
//     expect(clientMock.get).toHaveBeenCalled();
//     const args = clientMock.get.calls.mostRecent().args;
//     expect(args[0]).toBe(url);
//     expect(args[1]).toEqual({ limit: 12, offset: '' });
//   }));
//
//   it('should accept a usd p2p boost', fakeAsync(() => {
//     const boost = {
//       guid: '1234',
//       handler: 'p2p',
//       state: 'created',
//       currency: 'usd'
//     };
//
//     const url = 'api/v2/boost/peer/1234';
//     clientMock.response[url] = { status: 'success' };
//
//     service.accept(boost);
//     jasmine.clock().tick(10);
//     expect(clientMock.put).toHaveBeenCalled();
//     expect(clientMock.put.calls.mostRecent().args[0]).toBe(url);
//     expect(boostContractServiceMock.accept).not.toHaveBeenCalled();
//   }));
//
//   it('should accept a p2p boost', fakeAsync(() => {
//     const boost = {
//       guid: '1234',
//       handler: 'p2p',
//       state: 'created',
//       currency: 'tokens'
//     };
//
//     const url = 'api/v2/boost/peer/1234';
//     clientMock.response[url] = { status: 'success' };
//
//     service.accept(boost);
//     jasmine.clock().tick(10);
//     expect(clientMock.put).toHaveBeenCalled();
//     expect(clientMock.put.calls.mostRecent().args[0]).toBe(url);
//     expect(boostContractServiceMock.accept).toHaveBeenCalled();
//     expect(boostContractServiceMock.accept.calls.mostRecent().args[0]).toBe('1234');
//   }));
//
//   it('should reject a p2p boost', fakeAsync(() => {
//     const boost = {
//       guid: '1234',
//       handler: 'p2p',
//       state: 'created',
//       currency: 'tokens'
//     };
//
//     const url = 'api/v2/boost/peer/1234';
//     clientMock.response[url] = { status: 'success' };
//
//     service.reject(boost);
//     tick(500);
//     // tick(500);
//
//     expect(clientMock.delete).toHaveBeenCalled();
//     expect(clientMock.delete.calls.mostRecent().args[0]).toBe(url);
//     expect(boostContractServiceMock.reject).toHaveBeenCalled();
//     expect(boostContractServiceMock.reject.calls.mostRecent().args[0]).toBe('1234');
//   }));
//
//   it('should reject a usd p2p boost', fakeAsync(() => {
//     const boost = {
//       guid: '1234',
//       handler: 'p2p',
//       state: 'created',
//       currency: 'usd'
//     };
//
//     const url = 'api/v2/boost/peer/1234';
//     clientMock.response[url] = { status: 'success' };
//
//     service.reject(boost);
//     jasmine.clock().tick(10);
//     expect(clientMock.delete).toHaveBeenCalled();
//     expect(clientMock.delete.calls.mostRecent().args[0]).toBe(url);
//     expect(boostContractServiceMock.reject).not.toHaveBeenCalled();
//   }));
//
//   it('should revoke a non p2p usd boost', fakeAsync(() => {
//     const boost = {
//       guid: '1234',
//       handler: 'newsfeed',
//       state: 'created',
//       currency: 'usd'
//     };
//
//     const url = 'api/v2/boost/newsfeed/1234/revoke';
//     clientMock.response[url] = { status: 'success' };
//
//     service.revoke(boost);
//     jasmine.clock().tick(10);
//     expect(clientMock.delete).toHaveBeenCalled();
//     expect(clientMock.delete.calls.mostRecent().args[0]).toBe(url);
//     expect(boostContractServiceMock.revoke).not.toHaveBeenCalled();
//   }));
//
//   it('should revoke a non p2p boost', fakeAsync(() => {
//     const boost = {
//       guid: '1234',
//       handler: 'newsfeed',
//       state: 'created',
//       currency: 'tokens'
//     };
//
//     const url = 'api/v2/boost/newsfeed/1234/revoke';
//     clientMock.response[url] = { status: 'success' };
//
//     service.revoke(boost);
//     jasmine.clock().tick(10);
//     expect(clientMock.delete).toHaveBeenCalled();
//     expect(clientMock.delete.calls.mostRecent().args[0]).toBe(url);
//     expect(boostContractServiceMock.revoke).toHaveBeenCalled();
//     expect(boostContractServiceMock.revoke.calls.mostRecent().args[0]).toBe('1234');
//   }));
//
//   it('should revoke a p2p usd boost', fakeAsync(() => {
//     const boost = {
//       guid: '1234',
//       handler: 'p2p',
//       state: 'created',
//       currency: 'usd'
//     };
//
//     const url = 'api/v2/boost/peer/1234/revoke';
//     clientMock.response[url] = { status: 'success' };
//
//     service.revoke(boost);
//     jasmine.clock().tick(10);
//     expect(clientMock.delete).toHaveBeenCalled();
//     expect(clientMock.delete.calls.mostRecent().args[0]).toBe(url);
//     expect(boostContractServiceMock.revoke).not.toHaveBeenCalled();
//   }));
//
//   it('should revoke a p2p boost', fakeAsync(() => {
//     const boost = {
//       guid: '1234',
//       handler: 'p2p',
//       state: 'created',
//       currency: 'tokens'
//     };
//
//     const url = 'api/v2/boost/peer/1234/revoke';
//     clientMock.response[url] = { status: 'success' };
//
//     service.revoke(boost);
//     jasmine.clock().tick(10);
//     expect(clientMock.delete).toHaveBeenCalled();
//     expect(clientMock.delete.calls.mostRecent().args[0]).toBe(url);
//     expect(boostContractServiceMock.revoke).toHaveBeenCalled();
//     expect(boostContractServiceMock.revoke.calls.mostRecent().args[0]).toBe('1234');
//   }));
//
// });
