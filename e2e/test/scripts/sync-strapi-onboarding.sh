#!/bin/bash

# Syncs the onboarding version from the CMS to the local file system
# to be returned as a mock response.

FILE_PATH="./generated/strapi-onboarding-version-response.json"

curl 'https://cms.oke.minds.io/graphql' \
    -H 'Accept-Encoding: gzip, deflate, br' \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json' \
    -H 'Connection: keep-alive' \
    --data-binary '{"query":"query FetchOnboardingV5Versions {\n  onboardingV5Versions {\n    data {\n      attributes {\n        publishedAt\n        steps {\n          __typename\n          ... on ComponentOnboardingV5OnboardingStep {\n            id\n            carousel {\n              id\n              __typename\n              title\n              media {\n                data {\n                  attributes {\n                    url\n                    height\n                    width\n                    alternativeText\n                    hash\n                    mime\n                    name\n                    provider\n                    size\n                  }\n                }\n              }\n            }\n            title\n            description\n            stepKey\n            stepType\n            verifyEmailForm {\n              id\n              __typename\n              inputLabel\n              inputPlaceholder\n              resendCodeText\n              resendCodeActionText\n            }\n            tagSelector {\n              id\n              __typename\n              customTagInputText\n            }\n            radioSurveyQuestion\n            radioSurvey {\n              id\n              __typename\n              optionTitle\n              optionDescription\n              optionKey\n            }\n            userSelector {\n              id\n              __typename\n            }\n            groupSelector {\n              id\n              __typename\n            }\n            actionButton {\n              id\n              __typename\n              text\n              dataRef\n            }\n            skipButton {\n              id\n              __typename\n              text\n              dataRef\n            }\n          }\n        }\n        completionStep {\n          id\n          __typename\n          message\n          media {\n            data {\n              attributes {\n                url\n                height\n                width\n                alternativeText\n                hash\n                mime\n                name\n                provider\n                size\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n","variables":{}}' \
    --compressed \
    --output $FILE_PATH

echo "Saved response to $FILE_PATH"
