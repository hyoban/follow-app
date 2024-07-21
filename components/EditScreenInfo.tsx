import { YStack, H4, Paragraph } from 'tamagui';

export const EditScreenInfo = ({ path }: { path: string }) => {
  const title = 'Open up the code for this screen:';
  const description =
    'Change any of the text, save the file, and your app will automatically update.';

  return (
    <YStack>
      <YStack alignItems="center" marginHorizontal="$6">
        <H4>{title}</H4>
        <YStack borderRadius="$3" marginVertical="$1">
          <Paragraph>{path}</Paragraph>
        </YStack>
        <Paragraph>{description}</Paragraph>
      </YStack>
    </YStack>
  );
};
