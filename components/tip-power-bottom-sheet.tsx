import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import useSWR from 'swr'

import { apiClient } from '~/api/client'
import { Iconify, Row, Text, TextButton } from '~/components'
import type { Entry, Feed } from '~/db/schema'

import { Image } from './image'

export function TipPowerBottomSheet({
  bottomSheetModalRef,
  entry,
}: {
  entry: Entry & { feed: Feed }
  bottomSheetModalRef: React.RefObject<BottomSheetModal>
}) {
  const [selectedPower, setSelectedPower] = useState<number | null>(null)
  const { styles } = useStyles(styleSheet)
  const { ownerUserId } = entry.feed
  const { data, isLoading } = useSWR(
    ownerUserId ? ['profile', ownerUserId] : null,
    () => apiClient.profiles.$get({ query: { id: ownerUserId! } }),
  )

  return (
    <BottomSheetModal
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.bottomSheetHandleIndicator}
      handleStyle={styles.bottomSheetHandle}
      ref={bottomSheetModalRef}

      snapPoints={['50%']}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          onPress={() => {
            bottomSheetModalRef.current?.dismiss()
          }}
        />
      )}
    >
      <BottomSheetView style={styles.bottomSheetView}>
        <Text style={styles.viewTitle}>Tip Power</Text>
        {
          isLoading ? null : (
            data?.data
              ? (
                  <>
                    <Text>Feed Owner</Text>
                    <Row gap={10} align="center">
                      <Image
                        source={data.data.image}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                        }}
                      />
                      <Text>{data.data.name}</Text>
                    </Row>
                  </>
                )
              : (
                  <Text size={14}>No one has claimed this feed yet. The received Power will be securely held in the blockchain contract until it is claimed.</Text>
                )
          )
        }
        <Row h={1} w="100%" bg="component" my={6} />
        <Row gap={6} align="center">
          <Iconify icon="mgc:power" />
          <Text weight="600">Amount</Text>
        </Row>
        <Row gap={10}>
          <TextButton
            title="1 Power"
            color={selectedPower === 1 ? 'accent' : 'gray'}
            onPress={() => setSelectedPower(1)}
          />
          <TextButton
            title="2 Power"
            color={selectedPower === 2 ? 'accent' : 'gray'}
            onPress={() => setSelectedPower(2)}
          />
        </Row>
        <TextButton
          title="Tip Now"
          variant="solid"
          color="accent"
          style={{
            alignSelf: 'flex-end',
            marginTop: 20,
          }}
          disabled={selectedPower === null}
        />
      </BottomSheetView>
    </BottomSheetModal>
  )
}

const styleSheet = createStyleSheet(theme => ({
  leftAction: {
    backgroundColor: theme.colors.accent10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  bottomSheetBackground: {
    backgroundColor: theme.colors.gray2,
  },
  bottomSheetHandleIndicator: {
    backgroundColor: theme.colors.gray11,
  },
  bottomSheetHandle: {
    backgroundColor: theme.colors.gray2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottomSheetView: {
    backgroundColor: theme.colors.gray2,
    flex: 1,
    padding: 20,
    gap: 10,
  },
  viewTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
}))
