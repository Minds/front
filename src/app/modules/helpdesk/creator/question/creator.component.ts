import { Component, OnInit, ViewChild } from '@angular/core';
import { Client } from '../../../../services/api/client';
import { ActivatedRoute, Router } from '@angular/router';
import { InlineEditorComponent } from "../../../../common/components/editors/inline-editor.component";

@Component({
  selector: 'm-helpdesk--question-creator',
  templateUrl: 'creator.component.html'
})

export class QuestionCreatorComponent implements OnInit {
  @ViewChild('inlineEditor') inlineEditor: InlineEditorComponent;

  categories: Array<any> = [];

  error: string = null;

  question: any = {
    question: '',
    answer: '',
    category_uuid: null,
  };

  constructor(
    public client: Client,
    public router: Router,
    public route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.loadCategories();

    this.route.params.subscribe((params) => {
      if (params['uuid'] && params['uuid'] !== 'new') {
        this.load(params['uuid']);
      }
    });
  }

  trackCategories(index, category) {
    return category.uuid;
  }

  async loadCategories() {
    try {
      const response: any = await this.client.get(`api/v2/helpdesk/categories`, { limit: 200, recursive: true });
      this.categories = this.categoriesToArray(response.categories);
    } catch (e) {
      console.error(e);
    }
  }

  private categoriesToArray(categories: Array<any>) {
    const catArray = [];

    for (let category of categories) {
      catArray.push(category);

      let cat = category;
      while (cat.parent) {
        catArray.unshift(cat.parent);
        cat = cat.parent;
      }
    }

    // unique
    return catArray.filter((item, index, array) => array.findIndex((value) => value.uuid === item.uuid) === index);
  }

  private renderBranch(category) {
    // first get the whole branch
    let branch = [];
    let cat = category;
    while (cat) {
      branch.push(cat);
      cat = cat.parent;
    }

    let text = [];
    for (let i = branch.length - 1; i >= 0; --i) {
      text.push(branch[i].title);
    }

    return text.join(' > ');
  }

  selectCategory(category) {
    this.question.category_uuid = category.uuid;
  }

  async load(uuid: string) {
    try {
      const response: any = await this.client.get(`api/v2/helpdesk/questions/question/${uuid}`);

      this.question = response.question;

      if (!this.question.answer.includes('<p>')) {
        this.question.answer = `<p class="">${this.question.answer}</p>`;
      }
    } catch (e) {
      console.error(e);
    }
  }

  validate() {
    this.error = null;

    if (!this.question.category_uuid) {
      this.error = 'You must select a category';
    }
    if (!this.question.answer) {
      this.error = 'You must provide an answer';
    }
    if (!this.question.question) {
      this.error = 'You must provide a question';
    }

    if (this.error) {
      throw new Error();
    }
  }

  async save() {
    try {
      this.validate();
    } catch (e) {
      return;
    }

    await this.inlineEditor.prepareForSave();

    try {
      const response: any = await this.client.post('api/v2/admin/helpdesk/questions', { ...this.question });

      this.router.navigate(['/help/question/', response.uuid]);
    } catch (e) {
      console.error(e);
      this.error = e;
    }
  }

}
