import { useMemo, useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { useTheme } from '../theme-provider'
import { simulateHybrid, escrowFinish } from '../services/api'

export default function PosScreen({ navigation, route }: any) {
  const theme = useTheme()
  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.bg, padding: 24, gap: 16 },
    title: { color: theme.colors.text, fontSize: 22, fontWeight: '700' },
    subtitle: { color: theme.colors.textSubtle },
    inputRow: { gap: 8 },
    label: { color: theme.colors.textMuted },
    input: { backgroundColor: theme.colors.surface, borderRadius: theme.radii.sm, paddingHorizontal: 12, paddingVertical: 10, color: theme.colors.text, borderWidth: 1, borderColor: theme.colors.border },

    actionRow: { flexDirection: 'row', gap: 12 },
    generateBtn: { flex: 1, backgroundColor: theme.colors.primary, paddingVertical: 12, borderRadius: theme.radii.sm, alignItems: 'center' },
    generateText: { color: theme.colors.textOnPrimary, fontWeight: '700' },
    tapBtn: { flex: 1, backgroundColor: theme.colors.surface2, paddingVertical: 12, borderRadius: theme.radii.sm, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
    tapText: { color: theme.colors.text, fontWeight: '700' },

    qrBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radii.md, backgroundColor: theme.colors.surface2 },
    qrHint: { color: theme.colors.textMuted },
    infoBox: { backgroundColor: theme.colors.surface, padding: 12, borderRadius: theme.radii.md, gap: 6, borderWidth: 1, borderColor: theme.colors.border },
    infoText: { color: theme.colors.textSubtle },
    finishBtn: { backgroundColor: theme.colors.success, paddingVertical: 12, borderRadius: theme.radii.sm, alignItems: 'center' },
    finishText: { color: theme.colors.textOnPrimary, fontWeight: '700' },
    dashboardLink: { alignItems: 'center', paddingVertical: 8 },
    dashboardLinkText: { color: theme.colors.primaryHover },
  }), [theme])

  const paramMerchant: string | undefined = route?.params?.merchant
  const [amount, setAmount] = useState('50.00')
  const [qrValue, setQrValue] = useState('')
  const [merchant, setMerchant] = useState<string>(paramMerchant || '')
  const [escrowInfo, setEscrowInfo] = useState<null | { mode?: string; sequence?: number; txHash?: string; amount?: string }>(null)

  useEffect(() => {
    if (paramMerchant && paramMerchant !== merchant) setMerchant(paramMerchant)
  }, [paramMerchant])

  const ensureMerchant = () => {
    if (!merchant) {
      Alert.alert('Merchant', 'Carteira não configurada. Faça login para iniciar o onboarding.')
      return false
    }
    return true
  }

  const onGenerateQR = async () => {
    try {
      if (!ensureMerchant()) return
      const payload = JSON.stringify({
        amount,
        currency: 'BRL',
        methods: ['PIX', 'CARD', 'CRYPTO'],
        link: `https://payhub.example/checkout?total=${amount}`,
      })
      setQrValue(payload)

      const data = await simulateHybrid({ merchant, fiat_value_brl: Number(amount), rate_brl_per_rlusd: 1, finish_after_seconds: 60 })
      setEscrowInfo({ mode: data?.mode, sequence: data?.sequence, txHash: data?.txHash, amount: data?.amount_rlusd })
      Alert.alert('Pagamento', data?.mode === 'token_escrow' ? 'Escrow RLUSD criado com sucesso' : 'Pagamento RLUSD efetuado (fallback)')
    } catch (err: any) {
      Alert.alert('Pagamento', `Falha ao iniciar: ${err?.message || String(err)}`)
    }
  }

  const onTapToPay = async () => {
    try {
      if (!ensureMerchant()) return
      const payload = JSON.stringify({
        amount,
        currency: 'BRL',
        method: 'CONTACTLESS',
        note: 'Tap to Pay (stub)',
      })
      setQrValue(payload)
      const data = await simulateHybrid({ merchant, fiat_value_brl: Number(amount), rate_brl_per_rlusd: 1, finish_after_seconds: 60 })
      setEscrowInfo({ mode: data?.mode, sequence: data?.sequence, txHash: data?.txHash, amount: data?.amount_rlusd })
      Alert.alert('Tap to Pay', 'Transação iniciada (simulação).')
    } catch (err: any) {
      Alert.alert('Tap to Pay', `Falha: ${err?.message || String(err)}`)
    }
  }

  const onMarkDelivered = async () => {
    try {
      if (escrowInfo?.mode === 'token_escrow' && escrowInfo.sequence !== undefined) {
        await escrowFinish({ offerSequence: escrowInfo.sequence })
        Alert.alert('Transação', 'EscrowFinish disparado — RLUSD liberado')
      } else {
        Alert.alert('Transação', 'Modo fallback (Payment direto) — nada a finalizar')
      }
    } catch (err: any) {
      Alert.alert('Transação', `Falha: ${err?.message || String(err)}`)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Soft-POS — Tap to Pay / QR</Text>
      <Text style={styles.subtitle}>Digite o valor e gere o QR Híbrido</Text>

      <View style={styles.inputRow}>
        <Text style={styles.label}>Valor (R$)</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          style={styles.input}
          placeholder="0,00"
          placeholderTextColor={theme.colors.textMuted}
        />
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.generateBtn} onPress={onGenerateQR}>
          <Text style={styles.generateText}>Gerar Pagamento</Text>
        </Pressable>
        <Pressable style={styles.tapBtn} onPress={onTapToPay}>
          <Text style={styles.tapText}>Tap to Pay</Text>
        </Pressable>
      </View>

      <View style={styles.qrBox}>
        {qrValue ? (
          <QRCode value={qrValue} size={180} backgroundColor={theme.colors.bg} color={theme.colors.accentGreen} />
        ) : (
          <Text style={styles.qrHint}>QR Code aparecerá aqui</Text>
        )}
      </View>

      {escrowInfo && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Modo: {escrowInfo.mode}</Text>
          {escrowInfo.amount && <Text style={styles.infoText}>RLUSD: {escrowInfo.amount}</Text>}
          {escrowInfo.txHash && <Text style={styles.infoText}>txHash: {escrowInfo.txHash}</Text>}
          {escrowInfo.sequence !== undefined && <Text style={styles.infoText}>Sequence: {escrowInfo.sequence}</Text>}
        </View>
      )}

      <Pressable style={styles.finishBtn} onPress={onMarkDelivered}>
        <Text style={styles.finishText}>Marcar como Entregue</Text>
      </Pressable>

      <Pressable style={styles.dashboardLink} onPress={() => navigation.navigate('Dashboard')}> 
        <Text style={styles.dashboardLinkText}>Ver Dashboard</Text>
      </Pressable>
    </View>
  )
}