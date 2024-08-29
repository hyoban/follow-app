import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { from } from 'dnum'
import { useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

import { apiClient } from '~/api/client'
import { Iconify, Row, Text, TextButton } from '~/components'
import type { Entry, Feed } from '~/db/schema'
import { useCurrentUser } from '~/hooks/use-current-user'

import { Image } from './image'

export function TipPowerBottomSheet({
  bottomSheetModalRef,
  entry,
}: {
  entry: Entry & { feed: Feed }
  bottomSheetModalRef: React.RefObject<BottomSheetModal>
}) {
  const [amount, setAmount] = useState<1 | 2>(1)
  const amountBigInt = from(amount, 18)[0]
  const { styles } = useStyles(styleSheet)
  const { ownerUserId } = entry.feed
  const { user: currentUser } = useCurrentUser()
  const { data: wallet } = useSWR(
    currentUser ? ['wallet', currentUser.id] : null,
    () => apiClient.wallets.$get({ query: { userId: currentUser!.id } }),
  )
  const myWalletData = wallet?.data?.[0]
  const dPowerBigInt = BigInt(myWalletData?.dailyPowerToken ?? 0)
  const cPowerBigInt = BigInt(myWalletData?.cashablePowerToken ?? 0)
  const balanceBigInt = cPowerBigInt + dPowerBigInt
  const wrongNumberRange = amountBigInt > balanceBigInt || amountBigInt <= BigInt(0)

  const { data: ownerProfile, isLoading } = useSWR(
    ownerUserId ? ['profile', ownerUserId] : null,
    () => apiClient.profiles.$get({ query: { id: ownerUserId! } }),
  )

  const {
    data: tipResult,
    trigger,
    isMutating,
    reset,
  } = useSWRMutation(
    ['tip', entry.id],
    () =>
      apiClient.wallets.transactions.tip.$post({
        json: {
          amount: String(amountBigInt),
          feedId: entry.feedId,
          userId: entry.feed.ownerUserId!,
        },
      }),
  )
  const isTipSuccess = !!tipResult?.data.transactionHash

  return (
    <BottomSheetModal
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.bottomSheetHandleIndicator}
      handleStyle={styles.bottomSheetHandle}
      ref={bottomSheetModalRef}

      snapPoints={['50%']}
      onChange={() => {
        if (isTipSuccess) {
          reset()
        }
      }}
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
        {isTipSuccess ? (
          <Text size={14}>Tip sent successfully! Thank you for your support.</Text>
        ) : isLoading
          ? null
          : ownerProfile?.data
            ? (
                <>
                  <Text>Feed Owner</Text>
                  <Row gap={10} align="center">
                    <Image
                      source={ownerProfile.data.image}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                      }}
                    />
                    <Text>{ownerProfile.data.name}</Text>
                  </Row>
                </>
              )
            : (
                <Text size={14}>
                  No one has claimed this feed yet. The received Power will be
                  securely held in the blockchain contract until it is claimed.
                </Text>
              )}
        <Row h={1} w="100%" bg="component" my={6} />
        {
          isTipSuccess ? (
            <Text>
              {amount} Power has been sent to the feed owner.
            </Text>
          ) : (
            <>
              <Row gap={6} align="center">
                <Iconify icon="mgc:power" />
                <Text weight="600">Amount</Text>
              </Row>
              <Row gap={10}>
                <TextButton
                  title="1 Power"
                  color={amount === 1 ? 'accent' : 'gray'}
                  onPress={() => setAmount(1)}
                />
                <TextButton
                  title="2 Power"
                  color={amount === 2 ? 'accent' : 'gray'}
                  onPress={() => setAmount(2)}
                />
              </Row>
            </>
          )
        }
        <TextButton
          title={
            isTipSuccess
              ? 'OK'
              : wrongNumberRange
                ? 'Insufficient Power'
                : 'Tip Now'
          }
          variant="solid"
          color="accent"
          style={{
            alignSelf: 'flex-end',
            marginTop: 20,
          }}
          disabled={!currentUser || !ownerUserId || wrongNumberRange}
          onPress={() => {
            if (isTipSuccess) {
              bottomSheetModalRef.current?.dismiss()
              return
            }
            trigger().catch(console.error)
          }}
          isLoading={isMutating}
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
