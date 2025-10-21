import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native'
import { useMemo, useState } from 'react'
import { useTheme } from '../theme-provider'
import { setupXRPL } from '../services/api'

export default function LoginScreen({ navigation }: any) {
  const theme = useTheme()
  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16 },
    title: { color: theme.colors.text, fontSize: 24, fontWeight: '700' },
    subtitle: { color: theme.colors.textSubtle, fontSize: 14 },
    buttons: { width: '100%', gap: 12 },
    copyBox: { width: '100%', backgroundColor: theme.colors.surface, padding: 12, borderRadius: theme.radii.sm, borderWidth: 1, borderColor: theme.colors.border, gap: 4 },
    copyTitle: { color: theme.colors.text, fontSize: 16, fontWeight: '700' },
    copySub: { color: theme.colors.textSubtle, fontSize: 12 },
    copyProof: { color: theme.colors.textSubtle, fontSize: 12 },
    buttonPrimary: { backgroundColor: theme.colors.primary, paddingVertical: 12, borderRadius: theme.radii.sm, alignItems: 'center' },
    buttonSecondary: { backgroundColor: theme.colors.surface, paddingVertical: 12, borderRadius: theme.radii.sm, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
    buttonTextDark: { color: theme.colors.textOnPrimary, fontWeight: '700' },
    buttonTextLight: { color: theme.colors.text, fontWeight: '700' },
  }), [theme])

  const [loading, setLoading] = useState(false)

  const handleLogin = async (method: 'email' | 'wallet') => {
    try {
      setLoading(true)
      const { merchantAddress } = await setupXRPL()
      if (!merchantAddress) throw new Error('Carteira do comerciante não foi retornada')
      Alert.alert('Login', `Login ${method === 'email' ? 'por Email' : 'via Wallet'} concluído.\nCarteira: ${merchantAddress}`)
      navigation.replace('Dashboard', { merchant: merchantAddress })
    } catch (err: any) {
      Alert.alert('Login', `Falha no onboarding: ${err?.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PAYHUB — One-Click Login</Text>
      <Text style={styles.subtitle}>Escolha como deseja entrar</Text>

      <View style={styles.buttons}>
        <View style={styles.copyBox}>
          <Text style={styles.copyTitle}>Transforme seu celular em Soft-POS</Text>
          <Text style={styles.copySub}>Liquidez em 3–5s via XRPL • APY 5–8% (auto-yield)</Text>
          <Text style={styles.copyProof}>Escrow RLUSD confirma e liquida sem risco de chargeback.</Text>
        </View>
        <Pressable style={styles.buttonPrimary} onPress={() => handleLogin('email')} disabled={loading}>
          {loading ? <ActivityIndicator color={theme.colors.textOnPrimary} /> : <Text style={styles.buttonTextDark}>Começar agora</Text>}
        </Pressable>
        <Pressable style={styles.buttonSecondary} onPress={() => navigation.navigate('POS')} disabled={loading}>
          <Text style={styles.buttonTextLight}>Explorar POS</Text>
        </Pressable>
      </View>
    </View>
  )
}