// mock data for onboarding v5 versions response.
export const mockOnboardingV5VersionsData = {
  data: {
    onboardingV5Versions: {
      data: [
        {
          attributes: {
            publishedAt: '2023-06-14T10:39:05.268Z',
            steps: [
              {
                __typename: 'ComponentOnboardingV5OnboardingStep',
                id: '13',
                carousel: [
                  {
                    id: '19',
                    __typename: 'ComponentOnboardingV5CarouselItem',
                    title: 'Own your identity, content and social graph',
                    media: {
                      data: {
                        attributes: {
                          url: '/uploads/onboarding_screen_hashtag_mockup_1_3ce97d4b10.png',
                          height: 2241,
                          width: 1100,
                          alternativeText: null,
                          hash: 'onboarding_screen_hashtag_mockup_1_3ce97d4b10',
                          mime: 'image/png',
                          name: 'onboarding-screen-hashtag-mockup(1).png',
                          provider: 'local',
                          size: 110.39,
                          __typename: 'UploadFile',
                        },
                        __typename: 'UploadFileEntity',
                      },
                      __typename: 'UploadFileEntityResponse',
                    },
                  },
                  {
                    id: '26',
                    __typename: 'ComponentOnboardingV5CarouselItem',
                    title: 'Second Item',
                    media: {
                      data: {
                        attributes: {
                          url: '/uploads/book_burning_8acf3c008c.jpg',
                          height: 2048,
                          width: 1493,
                          alternativeText: null,
                          hash: 'book_burning_8acf3c008c',
                          mime: 'image/jpeg',
                          name: 'book-burning.jpg',
                          provider: 'local',
                          size: 211.04,
                          __typename: 'UploadFile',
                        },
                        __typename: 'UploadFileEntity',
                      },
                      __typename: 'UploadFileEntityResponse',
                    },
                  },
                  {
                    id: '27',
                    __typename: 'ComponentOnboardingV5CarouselItem',
                    title: 'Third Item',
                    media: {
                      data: {
                        attributes: {
                          url: '/uploads/holding_rewards_2164a15829.png',
                          height: 527,
                          width: 450,
                          alternativeText: null,
                          hash: 'holding_rewards_2164a15829',
                          mime: 'image/png',
                          name: 'holding-rewards.png',
                          provider: 'local',
                          size: 111.13,
                          __typename: 'UploadFile',
                        },
                        __typename: 'UploadFileEntity',
                      },
                      __typename: 'UploadFileEntityResponse',
                    },
                  },
                  {
                    id: '28',
                    __typename: 'ComponentOnboardingV5CarouselItem',
                    title: 'Fourth',
                    media: {
                      data: {
                        attributes: {
                          url: '/uploads/liquidity_rewards_4c44819589.png',
                          height: 561,
                          width: 446,
                          alternativeText: null,
                          hash: 'liquidity_rewards_4c44819589',
                          mime: 'image/png',
                          name: 'liquidity-rewards.png',
                          provider: 'local',
                          size: 79.04,
                          __typename: 'UploadFile',
                        },
                        __typename: 'UploadFileEntity',
                      },
                      __typename: 'UploadFileEntityResponse',
                    },
                  },
                ],
                title: 'Verify your email',
                description:
                  'Minds just sent a 6-digit authentication code to your registered email address.',
                stepKey: 'verify_email',
                stepType: 'verify_email',
                verifyEmailForm: {
                  id: '4',
                  __typename: 'ComponentOnboardingV5VerifyEmailStep',
                  inputLabel: 'Verification code',
                  inputPlaceholder: null,
                  resendCodeText:
                    'Didn’t get a code? Check your spam folder, or {action}.',
                  resendCodeActionText: 'resend code',
                },
                tagSelector: null,
                radioSurveyQuestion: null,
                radioSurvey: [],
                userSelector: null,
                groupSelector: null,
                actionButton: {
                  id: '12',
                  __typename: 'ComponentOnboardingV5ActionButton',
                  text: 'Verify',
                  dataRef: 'onboarding-verify-email-button',
                },
                skipButton: null,
              },
              {
                __typename: 'ComponentOnboardingV5OnboardingStep',
                id: '14',
                carousel: [
                  {
                    id: '20',
                    __typename: 'ComponentOnboardingV5CarouselItem',
                    title: 'Own your identity, content and social graph',
                    media: {
                      data: {
                        attributes: {
                          url: '/uploads/onboarding_screen_hashtag_mockup_63d5386ba5.png',
                          height: 561,
                          width: 275,
                          alternativeText: null,
                          hash: 'onboarding_screen_hashtag_mockup_63d5386ba5',
                          mime: 'image/png',
                          name: 'onboarding-screen-hashtag-mockup.png',
                          provider: 'local',
                          size: 15.36,
                          __typename: 'UploadFile',
                        },
                        __typename: 'UploadFileEntity',
                      },
                      __typename: 'UploadFileEntityResponse',
                    },
                  },
                ],
                title: 'Hashtags',
                description:
                  'Select at least 3 tags that are of interest to you. This helps us recommend relevant content.',
                stepKey: 'tag_selector',
                stepType: 'tag_selector',
                verifyEmailForm: null,
                tagSelector: {
                  id: '4',
                  __typename: 'ComponentOnboardingV5TagSelectorStep',
                  customTagInputText:
                    'Didn’t find what you were looking for? Add a custom tag',
                },
                radioSurveyQuestion: null,
                radioSurvey: [],
                userSelector: null,
                groupSelector: null,
                actionButton: {
                  id: '13',
                  __typename: 'ComponentOnboardingV5ActionButton',
                  text: 'Continue',
                  dataRef: 'onboarding-next-button',
                },
                skipButton: null,
              },
              {
                __typename: 'ComponentOnboardingV5OnboardingStep',
                id: '15',
                carousel: [
                  {
                    id: '21',
                    __typename: 'ComponentOnboardingV5CarouselItem',
                    title:
                      'Connect with creative minds and communities globally',
                    media: {
                      data: {
                        attributes: {
                          url: '/uploads/onboarding_screen_hashtag_mockup_63d5386ba5.png',
                          height: 561,
                          width: 275,
                          alternativeText: null,
                          hash: 'onboarding_screen_hashtag_mockup_63d5386ba5',
                          mime: 'image/png',
                          name: 'onboarding-screen-hashtag-mockup.png',
                          provider: 'local',
                          size: 15.36,
                          __typename: 'UploadFile',
                        },
                        __typename: 'UploadFileEntity',
                      },
                      __typename: 'UploadFileEntityResponse',
                    },
                  },
                  {
                    id: '22',
                    __typename: 'ComponentOnboardingV5CarouselItem',
                    title: 'The best place to grow your audience',
                    media: {
                      data: {
                        attributes: {
                          url: '/uploads/onboarding_screen_hashtag_mockup_63d5386ba5.png',
                          height: 561,
                          width: 275,
                          alternativeText: null,
                          hash: 'onboarding_screen_hashtag_mockup_63d5386ba5',
                          mime: 'image/png',
                          name: 'onboarding-screen-hashtag-mockup.png',
                          provider: 'local',
                          size: 15.36,
                          __typename: 'UploadFile',
                        },
                        __typename: 'UploadFileEntity',
                      },
                      __typename: 'UploadFileEntityResponse',
                    },
                  },
                  {
                    id: '23',
                    __typename: 'ComponentOnboardingV5CarouselItem',
                    title: 'Earn real revenue as a creator or affiliate',
                    media: {
                      data: {
                        attributes: {
                          url: '/uploads/onboarding_screen_hashtag_mockup_63d5386ba5.png',
                          height: 561,
                          width: 275,
                          alternativeText: null,
                          hash: 'onboarding_screen_hashtag_mockup_63d5386ba5',
                          mime: 'image/png',
                          name: 'onboarding-screen-hashtag-mockup.png',
                          provider: 'local',
                          size: 15.36,
                          __typename: 'UploadFile',
                        },
                        __typename: 'UploadFileEntity',
                      },
                      __typename: 'UploadFileEntityResponse',
                    },
                  },
                ],
                title: 'What do you want to do on Minds?',
                description:
                  'Minds uses this information to make your app experience better.',
                stepKey: 'onboarding_interest_survey',
                stepType: 'survey',
                verifyEmailForm: null,
                tagSelector: null,
                radioSurveyQuestion: 'I want to',
                radioSurvey: [
                  {
                    id: '16',
                    __typename: 'ComponentOnboardingV5RadioOption',
                    optionTitle: 'Discover like minded communities',
                    optionDescription: 'Don’t miss out on the discourse.',
                    optionKey: 'discover_communities',
                  },
                  {
                    id: '17',
                    __typename: 'ComponentOnboardingV5RadioOption',
                    optionTitle: 'Expand my reach',
                    optionDescription:
                      'Take your channel and content to the next level.',
                    optionKey: 'expand_my_reach',
                  },
                  {
                    id: '18',
                    __typename: 'ComponentOnboardingV5RadioOption',
                    optionTitle: 'Earn from original content',
                    optionDescription:
                      'Gain exposure and monetize your content today.',
                    optionKey: 'earn_from_content',
                  },
                ],
                userSelector: null,
                groupSelector: null,
                actionButton: {
                  id: '14',
                  __typename: 'ComponentOnboardingV5ActionButton',
                  text: 'Continue',
                  dataRef: 'onboarding-next-button',
                },
                skipButton: null,
              },
              {
                __typename: 'ComponentOnboardingV5OnboardingStep',
                id: '16',
                carousel: [
                  {
                    id: '24',
                    __typename: 'ComponentOnboardingV5CarouselItem',
                    title: 'Take back control of your social media',
                    media: {
                      data: {
                        attributes: {
                          url: '/uploads/onboarding_screen_hashtag_mockup_63d5386ba5.png',
                          height: 561,
                          width: 275,
                          alternativeText: null,
                          hash: 'onboarding_screen_hashtag_mockup_63d5386ba5',
                          mime: 'image/png',
                          name: 'onboarding-screen-hashtag-mockup.png',
                          provider: 'local',
                          size: 15.36,
                          __typename: 'UploadFile',
                        },
                        __typename: 'UploadFileEntity',
                      },
                      __typename: 'UploadFileEntityResponse',
                    },
                  },
                ],
                title: 'Subscribe',
                description:
                  "You'll see posts from people you subscribe to on your newsfeed.",
                stepKey: 'user_selector',
                stepType: 'user_selector',
                verifyEmailForm: null,
                tagSelector: null,
                radioSurveyQuestion: null,
                radioSurvey: [],
                userSelector: {
                  id: '4',
                  __typename: 'ComponentOnboardingV5UserSelectorStep',
                },
                groupSelector: null,
                actionButton: {
                  id: '15',
                  __typename: 'ComponentOnboardingV5ActionButton',
                  text: 'Continue',
                  dataRef: 'onboarding-next-button',
                },
                skipButton: {
                  id: '7',
                  __typename: 'ComponentOnboardingV5SkipButton',
                  text: 'Skip',
                  dataRef: null,
                },
              },
              {
                __typename: 'ComponentOnboardingV5OnboardingStep',
                id: '17',
                carousel: [
                  {
                    id: '25',
                    __typename: 'ComponentOnboardingV5CarouselItem',
                    title:
                      'Connect with creative minds and communities globally',
                    media: {
                      data: {
                        attributes: {
                          url: '/uploads/onboarding_screen_hashtag_mockup_63d5386ba5.png',
                          height: 561,
                          width: 275,
                          alternativeText: null,
                          hash: 'onboarding_screen_hashtag_mockup_63d5386ba5',
                          mime: 'image/png',
                          name: 'onboarding-screen-hashtag-mockup.png',
                          provider: 'local',
                          size: 15.36,
                          __typename: 'UploadFile',
                        },
                        __typename: 'UploadFileEntity',
                      },
                      __typename: 'UploadFileEntityResponse',
                    },
                  },
                ],
                title: 'Join Group',
                description: 'Find your community, speak your mind.',
                stepKey: 'group_selector',
                stepType: 'group_selector',
                verifyEmailForm: null,
                tagSelector: null,
                radioSurveyQuestion: null,
                radioSurvey: [],
                userSelector: null,
                groupSelector: {
                  id: '4',
                  __typename: 'ComponentOnboardingV5GroupSelectorStep',
                },
                actionButton: {
                  id: '16',
                  __typename: 'ComponentOnboardingV5ActionButton',
                  text: 'Continue',
                  dataRef: 'onboarding-next-button',
                },
                skipButton: {
                  id: '8',
                  __typename: 'ComponentOnboardingV5SkipButton',
                  text: 'Skip',
                  dataRef: null,
                },
              },
            ],
            completionStep: {
              id: '4',
              __typename: 'ComponentOnboardingV5CompletionStep',
              message: 'Welcome to Minds',
              media: {
                data: {
                  attributes: {
                    url: '/uploads/check_ef70ab0cb4.png',
                    height: 128,
                    width: 128,
                    alternativeText: 'Alt text for checkmark',
                    hash: 'check_ef70ab0cb4',
                    mime: 'image/png',
                    name: 'check.png',
                    provider: 'local',
                    size: 0.91,
                    __typename: 'UploadFile',
                  },
                  __typename: 'UploadFileEntity',
                },
                __typename: 'UploadFileEntityResponse',
              },
            },
            __typename: 'OnboardingV5Version',
          },
          __typename: 'OnboardingV5VersionEntity',
        },
      ],
      __typename: 'OnboardingV5VersionEntityResponseCollection',
    },
  },
};

// mock data for tenant onboarding v5 versions response.
export const mockTenantOnboardingV5VersionsData = {
  data: {
    onboardingV5Versions: {
      data: [
        {
          attributes: {
            publishedAt: '2023-06-14T10:39:05.268Z',
            steps: [
              {
                __typename: 'ComponentOnboardingV5OnboardingStep',
                id: '13',
                title: 'Verify your email',
                description:
                  'Minds just sent a 6-digit authentication code to your registered email address.',
                stepKey: 'verify_email',
                stepType: 'verify_email',
                verifyEmailForm: {
                  id: '4',
                  __typename: 'ComponentOnboardingV5VerifyEmailStep',
                  inputLabel: 'Verification code',
                  inputPlaceholder: null,
                  resendCodeText:
                    'Didn’t get a code? Check your spam folder, or {action}.',
                  resendCodeActionText: 'resend code',
                },
                tagSelector: null,
                radioSurveyQuestion: null,
                radioSurvey: [],
                userSelector: null,
                groupSelector: null,
                actionButton: {
                  id: '12',
                  __typename: 'ComponentOnboardingV5ActionButton',
                  text: 'Verify',
                  dataRef: 'onboarding-verify-email-button',
                },
                skipButton: null,
              },
            ],
            completionStep: {
              id: '4',
              __typename: 'ComponentOnboardingV5CompletionStep',
              message: 'Welcome to Minds',
              media: {
                data: {
                  attributes: {
                    url: '/uploads/check_ef70ab0cb4.png',
                    height: 128,
                    width: 128,
                    alternativeText: 'Alt text for checkmark',
                    hash: 'check_ef70ab0cb4',
                    mime: 'image/png',
                    name: 'check.png',
                    provider: 'local',
                    size: 0.91,
                    __typename: 'UploadFile',
                  },
                  __typename: 'UploadFileEntity',
                },
                __typename: 'UploadFileEntityResponse',
              },
            },
            __typename: 'OnboardingV5Version',
          },
          __typename: 'OnboardingV5VersionEntity',
        },
      ],
      __typename: 'OnboardingV5VersionEntityResponseCollection',
    },
  },
};
