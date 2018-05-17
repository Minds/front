import { TestBed } from "@angular/core/testing";
import { TagsPipe } from './tags';

describe('TagPipe', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TagsPipe],
    });
  });

  it('should transform when # in the middle ', () => {
    let pipe = new TagsPipe();
    let string = 'textstring#name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="/search')
  });

  it('should transform when # preceded by space ', () => {
    let pipe = new TagsPipe();
    let string = 'textstring #name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="/search')
  });

  it('should transform when # preceded by [] ', () => {
    let pipe = new TagsPipe();
    let string = 'textstring [#name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="/search')
  });

  it('should transform when # preceded by () ', () => {
    let pipe = new TagsPipe();
    let string = 'textstring (#name)';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="/search')
  });

  it('should transform when @ preceded by () ', () => {
    let pipe = new TagsPipe();
    let string = 'textstring (@name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a class="tag"')
  });

  it('should transform when @ preceded by [] ', () => {
    let pipe = new TagsPipe();
    let string = 'textstring [@name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a class="tag"')
  });

  it('should transform when @ preceded by space', () => {
    let pipe = new TagsPipe();
    let string = 'textstring @name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a class="tag"')
  });

  it('should transform to an email', () => {
    let pipe = new TagsPipe();
    let string = 'textstring@name.com';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="mailto:textstring@name.com"')
  });

  it('should not transform when @ not present', () => {
    let pipe = new TagsPipe();
    let string = 'textstring name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).not.toContain('<a class="tag"')
  });
});