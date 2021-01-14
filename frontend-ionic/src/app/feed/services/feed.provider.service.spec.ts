import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FeedProviderService } from './feed.provider.service';

describe('Feed.ProviderService', () => {
    beforeEach(() => TestBed.configureTestingModule({ imports: [HttpClientTestingModule] }));

    it('should be created', () => {
        const service: FeedProviderService = TestBed.get(FeedProviderService);
        expect(service).toBeTruthy();
    });
});
