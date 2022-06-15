import { RouterTestingModule } from '@angular/router/testing';
import { Story, Meta, moduleMetadata } from '@storybook/angular';
import { SiteService } from '../../services/site.service';
import { ReadMoreComponent } from './read-more.component';
import { ReadMoreModule } from './read-more.module';

export default {
  title: 'Components / Read More',
  argTypes: {
    text: {
      description: `The input text that you wish to truncate`,
      defaultValue: `Bacon ipsum dolor amet landjaeger meatloaf biltong alcatra ground round, ball tip hamburger bresaola salami short loin. T-bone flank cupim, pork belly spare ribs frankfurter jowl alcatra tongue pork chop brisket cow. Cow leberkas shank, chicken pancetta short ribs frankfurter. Tenderloin fatback kevin boudin pork belly, andouille doner turducken sirloin porchetta ground round swine short loin beef. Salami shankle short loin andouille pork chop strip steak tail.

                Strip steak kielbasa ground round, ribeye rump short loin capicola andouille swine venison tongue kevin brisket tri-tip leberkas. Ball tip landjaeger pork chop shank cupim, beef ribs short loin frankfurter turkey tongue boudin swine venison. Meatloaf brisket fatback prosciutto andouille capicola chicken tri-tip sirloin shankle. Bresaola alcatra beef ribs pork belly, rump hamburger meatloaf drumstick cupim. Doner frankfurter spare ribs, brisket ball tip boudin pastrami ham hock.
                
                T-bone venison hamburger porchetta spare ribs ribeye tenderloin. Turducken corned beef ribeye strip steak shoulder meatloaf flank brisket fatback. Corned beef pig turkey pork chop, chuck rump swine venison pork belly t-bone shankle turducken shank. Chicken pork belly ham hock porchetta corned beef filet mignon meatball capicola bacon spare ribs.
                
                Tenderloin boudin turducken sausage ribeye brisket pork chop porchetta beef ribs alcatra cow ball tip. Swine ham hock drumstick bacon ball tip leberkas doner strip steak. Doner turducken cow fatback spare ribs leberkas pork chop tenderloin strip steak. Picanha tail pig turducken.
                
                Chuck ground round shankle, filet mignon tri-tip short ribs tail kevin pork loin shoulder cow kielbasa. Sausage t-bone ball tip pork belly prosciutto short loin meatball kevin drumstick rump flank alcatra. Flank venison ham hock short ribs, tail kevin drumstick beef. Short loin pastrami chuck cupim pig, leberkas shank pork belly t-bone picanha landjaeger. Boudin ribeye fatback ham cow sirloin tri-tip spare ribs frankfurter prosciutto, shankle turducken kevin cupim. Andouille pancetta pork, pig capicola kevin fatback hamburger turducken. Flank shank sirloin, jerky cow t-bone ham meatball pancetta ground round tenderloin frankfurter.`,
      control: 'text',
    },
    targetLength: {
      description: `The length of the text you want to display before See more shows. This is only an approximation as we will not truncate words, only sentences. Also apply a buffer to this limit to avoid pointless truncating when the truncated part is only minimal`,
      defaultValue: 280,
      control: 'number',
    },
  },
  args: {},
  component: ReadMoreComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterTestingModule, ReadMoreModule],
      providers: [{ provide: SiteService, useValue: () => {} }],
    }),
  ],
} as Meta;

const Template: Story<ReadMoreComponent> = (args: any) => ({
  props: args,
});

export const LongText = Template.bind({});
LongText.args = {};

export const ShortText = Template.bind({});
ShortText.args = {
  text: 'This is only a small text block that will not trigger truncation',
};
