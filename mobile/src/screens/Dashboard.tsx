import React, { useMemo, useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Animated, ActivityIndicator, TextInput, PanResponder } from 'react-native'
import { useTheme, useThemeActions } from '../theme-provider'
import { quoteFees, tokenizeReceivable, defiBorrow } from '../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Dashboard de Carteira do Comerciante — tema dinâmico + copy de vendas

const makeStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.bg },
    content: { padding: 20, gap: 16 },

    hero: { backgroundColor: theme.colors.surface, borderRadius: theme.radii.md, padding: 16, borderWidth: 1, borderColor: theme.colors.border },
    heroTitle: { color: theme.colors.text, fontSize: 20, fontWeight: '800' },
    heroSub: { color: theme.colors.textSubtle, marginTop: 6 },
    heroProof: { color: theme.colors.textMuted, marginTop: 6 },

    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
    headerTitle: { color: theme.colors.text, fontSize: 22, fontWeight: '700' },
    headerIcon: { color: theme.colors.textSubtle, fontSize: 14 },
    toggleBtn: { backgroundColor: theme.colors.surface2, borderColor: theme.colors.border, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    toggleText: { color: theme.colors.text, fontWeight: '700' },

    balancePanel: { backgroundColor: theme.colors.surface, borderRadius: theme.radii.md, padding: 16, borderWidth: 1, borderColor: theme.colors.border },
    balanceLabel: { color: theme.colors.textSubtle, fontSize: 13 },
    balanceValue: { color: theme.colors.text, fontSize: 26, fontWeight: '800', marginTop: 4 },
    balanceSub: { color: theme.colors.textMuted, fontSize: 12, marginTop: 6 },

    card: { backgroundColor: theme.colors.surface, borderRadius: theme.radii.md, padding: 16, marginBottom: 8, borderLeftWidth: 3, borderWidth: 1, borderColor: theme.colors.border },
    cardTitle: { color: theme.colors.textMuted, fontSize: 14 },
    cardValue: { color: theme.colors.text, fontSize: 22, fontWeight: '700', marginTop: 6 },
    cardDetail: { fontSize: 12, marginTop: 4 },

    quickActions: { flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
    actionBtn: { flex: 1, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
    actionText: { color: theme.colors.text, fontWeight: '700' },

    softposBox: { alignItems: 'center', marginTop: 8 },
    softposBtn: { backgroundColor: theme.colors.primary, paddingVertical: 15, borderRadius: 10, width: '100%', alignItems: 'center', shadowColor: theme.colors.primary, shadowOpacity: 0.2, shadowOffset: { width: 0, height: 6 }, shadowRadius: 10 },
    softposText: { color: theme.colors.textOnPrimary, fontSize: 16, fontWeight: '700' },
    softposHint: { color: theme.colors.textMuted, fontSize: 12, marginTop: 10, textAlign: 'center' },

    linkPos: { alignItems: 'center', paddingVertical: 8 },
    linkPosText: { color: theme.colors.primaryHover },
    input: { backgroundColor: theme.colors.surface2, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, color: theme.colors.text },
    chip: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: theme.colors.surface2 },

    sliderTrack: { height: 6, borderRadius: 6, backgroundColor: theme.colors.surface2, borderColor: theme.colors.border, borderWidth: 1, marginTop: 6 },
    sliderHandle: { position: 'absolute', top: -6, width: 16, height: 16, borderRadius: 8, backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary, shadowOpacity: 0.4, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },

    sparkRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, marginTop: 8 },
    sparkBar: { width: 8, borderRadius: 3 },

    sliderLabel: { position: 'absolute', top: -24, backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, color: theme.colors.text },
    sliderTick: { position: 'absolute', top: -3, width: 1, height: 12, backgroundColor: theme.colors.border },
    sliderTickMajor: { position: 'absolute', top: -5, width: 2, height: 18, backgroundColor: theme.colors.textMuted },
    sliderTickActive: { position: 'absolute', top: -7, width: 3, height: 22, backgroundColor: theme.colors.primary },
    sliderMarkText: { position: 'absolute', top: -40, color: theme.colors.textMuted, fontSize: 10 },
    tooltipBox: { position: 'absolute', top: -68, backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, shadowColor: theme.colors.primary, shadowOpacity: 0.15, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, width: 120 },
    tooltipText: { color: theme.colors.text, fontSize: 11 },
    tooltipArrow: { position: 'absolute', bottom: -5, width: 10, height: 10, backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, transform: [{ rotate: '45deg' }] },
  })

const DashboardCard: React.FC<{ title: string; value: string; detail: string; accentColor: string; themeTokens: ReturnType<typeof useTheme>; children?: React.ReactNode }> = ({ title, value, detail, accentColor, themeTokens, children }) => (
  <View style={[makeStyles(themeTokens).card, { borderLeftColor: accentColor }]}> 
    <Text style={makeStyles(themeTokens).cardTitle}>{title}</Text>
    <Text style={makeStyles(themeTokens).cardValue}>{value}</Text>
    <Text style={[makeStyles(themeTokens).cardDetail, { color: accentColor }]}>{detail}</Text>
    {children}
  </View>
)

export default function DashboardScreen({ navigation, route }: any) {
  const theme = useTheme()
  const { toggleTheme, name } = useThemeActions()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const merchant: string | undefined = route?.params?.merchant

  const [mock] = useState({
    totalBalance: '14,090.90 RLUSD',
    yieldRate: '+8.5% APY',
    profitLastMonth: '142.08 RLUSD',
    lastTransaction: 'Venda Híbrida #7731',
  })

  const goToPos = () => {
    if (!merchant) {
      Alert.alert('Login necessário', 'Faça login para iniciar seu Soft-POS e configurar a carteira XRPL.')
      navigation.navigate('Login')
      return
    }
    navigation.navigate('POS', { merchant })
  }

  const [quote, setQuote] = useState<any | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [defiResult, setDefiResult] = useState<any | null>(null)
  const [borrowLoading, setBorrowLoading] = useState(false)
  const [quoteAmount, setQuoteAmount] = useState<string>('1000')
  const [quoteInstallments, setQuoteInstallments] = useState<string>('12')
  const [riskSegment, setRiskSegment] = useState<'low' | 'mid' | 'high'>('mid')

  const [apy, setApy] = useState<number>(0.08)
  const minApy = 0.04
  const maxApy = 0.12
  const apyPercent = useMemo(() => (apy * 100).toFixed(1), [apy])
  const aprFactor = useMemo(() => { const raw = Number(process.env.EXPO_PUBLIC_APR_FACTOR); return (!Number.isNaN(raw) && raw > 0) ? raw : 0.98 }, [])

  // Carregar APY persistido (web/nativo)
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const savedNative = AsyncStorage?.getItem ? await AsyncStorage.getItem('user-apy') : null
        const savedWeb = typeof window !== 'undefined' && (window as any).localStorage ? (window as any).localStorage.getItem('user-apy') : null
        const pick = savedNative ?? savedWeb
        if (pick && mounted) {
          const num = Number(pick)
          if (!Number.isNaN(num)) setApy(num)
        }
      } catch {}
    }
    load()
    return () => { mounted = false }
  }, [])

  // Carregar e salvar riskSegment (web/nativo)
  useEffect(() => {
    let mounted = true
    const loadRisk = async () => {
      try {
        const savedNative = AsyncStorage?.getItem ? await AsyncStorage.getItem('risk-seg') : null
        const savedWeb = typeof window !== 'undefined' && (window as any).localStorage ? (window as any).localStorage.getItem('risk-seg') : null
        const pick = savedNative ?? savedWeb
        if (pick && mounted && (pick === 'low' || pick === 'mid' || pick === 'high')) {
          setRiskSegment(pick as 'low' | 'mid' | 'high')
        }
      } catch {}
    }
    loadRisk()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    (async () => {
      try {
        if (AsyncStorage?.setItem) await AsyncStorage.setItem('risk-seg', riskSegment)
        else if (typeof window !== 'undefined' && (window as any).localStorage) (window as any).localStorage.setItem('risk-seg', riskSegment)
      } catch {}
    })()
  }, [riskSegment])

  const fadeQuote = useRef(new Animated.Value(0)).current
  const fadeBorrow = useRef(new Animated.Value(0)).current
  const toggleScale = useRef(new Animated.Value(1)).current
  const handleScale = useRef(new Animated.Value(1)).current
  const tooltipFade = useRef(new Animated.Value(0)).current
  const tooltipLeft = useRef(new Animated.Value(0)).current
  const arrowLeftAnim = useRef(new Animated.Value(0)).current

  const [sliderW, setSliderW] = useState(0)
  const [tooltipWidth, setTooltipWidth] = useState(0)
  const trackRef = useRef<any>(null)
  const [trackPageX, setTrackPageX] = useState(0)

  const panResponder = useMemo(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (trackRef.current && trackRef.current.measure) {
          trackRef.current.measure((_x: number, _y: number, width: number, _height: number, pageX: number) => {
            setTrackPageX(pageX)
            setSliderW(width)
          })
        }
        Animated.spring(handleScale, { toValue: 0.96, useNativeDriver: true }).start()
        Animated.timing(tooltipFade, { toValue: 1, duration: 150, useNativeDriver: true }).start()
      },
      onPanResponderMove: (_evt, gesture) => {
        const xAbs = gesture.moveX
        const xRel = xAbs - trackPageX
        const clamped = Math.max(0, Math.min(sliderW, xRel))
        const ratio = sliderW > 0 ? clamped / sliderW : 0
        const value = minApy + ratio * (maxApy - minApy)
        setApy(parseFloat(value.toFixed(4)))
      },
      onPanResponderRelease: (_evt, gesture) => {
        const xAbs = gesture.moveX
        const xRel = xAbs - trackPageX
        const clamped = Math.max(0, Math.min(sliderW, xRel))
        const ratio = sliderW > 0 ? clamped / sliderW : 0
        const raw = minApy + ratio * (maxApy - minApy)
        const step = 0.01
        const snapped = Math.max(minApy, Math.min(maxApy, Math.round((raw - minApy) / step) * step + minApy))
        const apyFinal = parseFloat(snapped.toFixed(4))
        setApy(apyFinal)
        try {
          if (AsyncStorage && AsyncStorage.setItem) {
            AsyncStorage.setItem('user-apy', String(apyFinal))
          } else if (typeof window !== 'undefined' && (window as any).localStorage) {
            (window as any).localStorage.setItem('user-apy', String(apyFinal))
          }
        } catch {}
        Animated.spring(handleScale, { toValue: 1, useNativeDriver: true }).start()
        Animated.timing(tooltipFade, { toValue: 0, duration: 120, useNativeDriver: true }).start()
      },
    }),
    [sliderW, trackPageX]
  )

  const sparkData = useMemo(() => {
    const monthly = apy / 12
    const arr = Array.from({ length: 12 }, (_, i) => monthly * (0.85 + 0.3 * Math.sin(i)))
    return arr
  }, [apy])
  const maxSpark = useMemo(() => Math.max(...sparkData, 0.0001), [sparkData])

  useEffect(() => {
    const handleX = ((apy - minApy) / (maxApy - minApy)) * sliderW
    const TW = tooltipWidth || 120
    const margin = 8
    const clamp = (val: number) => Math.max(0, Math.min(sliderW - TW, val))
    let boxLeft = clamp(handleX - TW / 2)
    let arrLeft = Math.max(0, (TW / 2) - 5)
    if (handleX < TW / 2) {
      boxLeft = clamp(handleX + margin)
      arrLeft = 8
    } else if (handleX > sliderW - TW / 2) {
      boxLeft = clamp(handleX - TW - margin)
      arrLeft = TW - 18
    }
    Animated.spring(tooltipLeft, { toValue: boxLeft, useNativeDriver: false, speed: 20, bounciness: 6 }).start()
    Animated.spring(arrowLeftAnim, { toValue: arrLeft, useNativeDriver: false, speed: 20, bounciness: 6 }).start()
  }, [apy, sliderW, tooltipWidth])

  const onFetchQuote = async () => {
    try {
      fadeQuote.setValue(0)
      setQuoteLoading(true)
      const amount = parseFloat(quoteAmount) || 0
      const installments = parseInt(quoteInstallments) || 1
      const resp = await quoteFees({ type: 'credit_parcelado', amount_brl: amount, installments, risk_segment: riskSegment, defi_apy: apy })
      setQuote(resp.quote)
      Animated.timing(fadeQuote, { toValue: 1, duration: 250, useNativeDriver: true }).start()
    } catch (err: any) {
      Alert.alert('Cotação', err?.message || String(err))
    } finally {
      setQuoteLoading(false)
    }
  }

  const onTokenizeAndBorrow = async () => {
    try {
      if (!merchant) {
        Alert.alert('Login necessário', 'Defina a carteira do comerciante primeiro.')
        return
      }
      setBorrowLoading(true)
      const token = await tokenizeReceivable({ sale_id: Date.now(), amount_total_brl: 1200, installments: 12, merchant })
      const borrow = await defiBorrow({ token_id: token.token_id, merchant, rate_brl_per_rlusd: 1, haircut_percent: 4, finish_after_seconds: 60 })
      setDefiResult({ token, borrow })
      Animated.timing(fadeBorrow, { toValue: 1, duration: 250, useNativeDriver: true }).start()
      Alert.alert('DeFi', borrow.mode === 'token_escrow' ? 'Liquidez em RLUSD bloqueada em Escrow' : 'Liquidez RLUSD liberada (fallback)')
    } catch (err: any) {
      Alert.alert('DeFi', err?.message || String(err))
    } finally {
      setBorrowLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Copy */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Seu Soft-POS sem maquininha</Text>
        <Text style={styles.heroSub}>Liquidez em 3–5s na XRPL • APY 5–8%</Text>
        <Text style={styles.heroProof}>Escrow RLUSD elimina risco de repasse; confirmação instantânea.</Text>
      </View>

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>PAYHUB WALLET</Text>
        <Animated.View style={{ transform: [{ scale: toggleScale }] }}>
          <Pressable
            style={styles.toggleBtn}
            onPress={toggleTheme}
            onPressIn={() => Animated.spring(toggleScale, { toValue: 0.96, useNativeDriver: true }).start()}
            onPressOut={() => Animated.spring(toggleScale, { toValue: 1, useNativeDriver: true }).start()}
          >
            <Text style={styles.toggleText}>{name === 'dark' ? '☀️ Claro' : '🌙 Escuro'}</Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Painel de saldo */}
      <View style={styles.balancePanel}>
        <Text style={styles.balanceLabel}>Saldo</Text>
        <Text style={styles.balanceValue}>{mock.totalBalance}</Text>
        <Text style={styles.balanceSub}>Liquidez total imediata (via XRPL)</Text>
      </View>

      {/* Card Rendimento com sparkline */}
      <DashboardCard
        title="Rendimento Ativo (Auto-Yield)"
        value={mock.profitLastMonth}
        detail={`Taxa de Lucro: ${apyPercent}% APY`}
        accentColor={theme.colors.accentGreen}
        themeTokens={theme}
      >
        <View style={styles.sparkRow}>
          {sparkData.map((v, idx) => (
            <View key={idx} style={[styles.sparkBar, { height: Math.max(3, (v / maxSpark) * 40), backgroundColor: theme.colors.accentGreen }]} />
          ))}
        </View>
      </DashboardCard>

      <DashboardCard
        title="Garantia de Liquidação (Escrow)"
        value="100% Livre de Risco"
        detail={`Última Transação: ${mock.lastTransaction}`}
        accentColor={theme.colors.accentCyan}
        themeTokens={theme}
      />

      {/* Ações rápidas */}
      <View style={styles.quickActions}>
        <Pressable style={[styles.actionBtn, { backgroundColor: theme.colors.primary }]} onPress={goToPos}>
          <Text style={[styles.actionText, { color: theme.colors.textOnPrimary }]}>Comece agora — Nova Venda</Text>
        </Pressable>
        <Pressable style={[styles.actionBtn, { backgroundColor: theme.colors.surface2 }]} onPress={() => Alert.alert('Freeze', 'Freeze (simulado)')}>
          <Text style={styles.actionText}>Freeze</Text>
        </Pressable>
        <Pressable style={[styles.actionBtn, { backgroundColor: theme.colors.surface2 }]} onPress={() => Alert.alert('Security', 'Security (simulado)')}>
          <Text style={styles.actionText}>Security</Text>
        </Pressable>
      </View>

      {/* Cotação de taxas e APY */}
      <View style={styles.balancePanel}>
        <Text style={styles.balanceLabel}>Cotação — Cartão Parcelado</Text>
        <View style={{ marginTop: 8, gap: 8 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput
              value={quoteAmount}
              onChangeText={setQuoteAmount}
              keyboardType="numeric"
              placeholder="Valor BRL"
              placeholderTextColor={theme.colors.textMuted}
              style={[styles.input, { flex: 1 }]}
            />
            <TextInput
              value={quoteInstallments}
              onChangeText={setQuoteInstallments}
              keyboardType="numeric"
              placeholder="Parcelas"
              placeholderTextColor={theme.colors.textMuted}
              style={[styles.input, { width: 100 }]}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['low','mid','high'] as const).map(seg => (
              <Pressable
                key={seg}
                onPress={() => setRiskSegment(seg)}
                style={[
                  styles.chip,
                  riskSegment === seg && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
                ]}
              >
                <Text style={{ color: riskSegment === seg ? theme.colors.textOnPrimary : theme.colors.text }}>
                  {seg === 'low' ? 'Baixo Risco' : seg === 'mid' ? 'Médio Risco' : 'Alto Risco'}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={{ marginTop: 4 }}>
            <Text style={[styles.balanceSub, { color: theme.colors.text }]}>APY previsto: {apyPercent}%</Text>
            <View style={{ position: 'relative' }}>
              <Text
                pointerEvents="none"
                style={[
                  styles.sliderLabel,
                  { left: Math.max(0, Math.min(sliderW - 40, ((apy - minApy) / (maxApy - minApy)) * sliderW - 20)) },
                ]}
              >
                {apyPercent}%
              </Text>
              {/* Tooltip APR/Yield */}
              <Animated.View
                pointerEvents="none"
                onLayout={(e) => setTooltipWidth(e.nativeEvent.layout.width)}
                style={[
                  styles.tooltipBox,
                  {
                    opacity: tooltipFade,
                    left: tooltipLeft as any,
                  },
                ]}
              >
                <View
                  pointerEvents="none"
                  style={[
                    styles.tooltipArrow,
                    {
                      left: arrowLeftAnim as any,
                    },
                  ]}
                />
                <Text style={styles.tooltipText}>
                  {`APY: ${apy.toFixed(2)}%  ·  APR: ${(apy * aprFactor).toFixed(2)}%  ·  Yield mensal: R$ ${(() => { const qa = Number(quoteAmount) || 1000; return (((qa * (apy / 100)) / 12)).toFixed(2); })()}`}
                </Text>
              </Animated.View>
              <Text pointerEvents="none" style={[styles.sliderMarkText, { left: Math.max(0, Math.min(sliderW - 24, ((minApy - minApy) / (maxApy - minApy)) * sliderW - 12)) } ]}>4%</Text>
              <Text pointerEvents="none" style={[styles.sliderMarkText, { left: Math.max(0, Math.min(sliderW - 24, ((minApy + 0.04 - minApy) / (maxApy - minApy)) * sliderW - 12)) } ]}>8%</Text>
              <Text pointerEvents="none" style={[styles.sliderMarkText, { left: Math.max(0, Math.min(sliderW - 24, ((maxApy - minApy) / (maxApy - minApy)) * sliderW - 12)) } ]}>12%</Text>
              <View
                ref={trackRef}
                style={styles.sliderTrack}
                onLayout={(e) => setSliderW(e.nativeEvent.layout.width)}
                {...panResponder.panHandlers}
              >
                {Array.from(
                  { length: Math.round((maxApy - minApy) / 0.005) + 1 },
                  (_, i) => {
                    const total = Math.round((maxApy - minApy) / 0.005)
                    const ratio = total > 0 ? i / total : 0
                    const left = Math.max(0, Math.min(sliderW - 1, ratio * sliderW))
                    return (
                      <View key={i} pointerEvents="none" style={[styles.sliderTick, { left }]} />
                    )
                  }
                )}
                {Array.from(
                  { length: Math.round((maxApy - minApy) / 0.01) + 1 },
                  (_, i) => {
                    const total = Math.round((maxApy - minApy) / 0.01)
                    const ratio = total > 0 ? i / total : 0
                    const left = Math.max(0, Math.min(sliderW - 2, ratio * sliderW))
                    return (
                      <View key={`major-${i}`} pointerEvents="none" style={[styles.sliderTickMajor, { left }]} />
                    )
                  }
                )}
                {(() => {
                  const total = Math.round((maxApy - minApy) / 0.01)
                  const idx = Math.max(0, Math.min(total, Math.round((apy - minApy) / 0.01)))
                  const ratio = total > 0 ? idx / total : 0
                  const left = Math.max(0, Math.min(sliderW - 3, ratio * sliderW))
                  return <View pointerEvents="none" style={[styles.sliderTickActive, { left }]} />
                })()}
                <Animated.View style={[styles.sliderHandle, { left: Math.max(0, Math.min(sliderW - 16, ((apy - minApy) / (maxApy - minApy)) * sliderW - 8)), transform: [{ scale: handleScale }] }]} />
              </View>
            </View>
          </View>
        </View>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: theme.colors.primary, marginTop: 8, opacity: quoteLoading ? 0.7 : 1 }]}
          onPress={onFetchQuote}
          disabled={quoteLoading}
        >
          {quoteLoading ? (
            <ActivityIndicator color={theme.colors.textOnPrimary} />
          ) : (
            <Text style={[styles.actionText, { color: theme.colors.textOnPrimary }]}>Obter Cotação</Text>
          )}
        </Pressable>
        {quote && (
          <Animated.View style={{ opacity: fadeQuote, marginTop: 10 }}>
            <Text style={[styles.balanceSub, { color: theme.colors.text }]}>Taxa total: {quote.totals.fee_percent}% | Liquidez imediata: R$ {quote.totals.merchant_net_brl}</Text>
            <Text style={[styles.balanceSub, { color: theme.colors.text }]}>Loan RLUSD: {quote.totals.loan_rlusd_value} | APY previsto: {quote.yield_assumptions.defi_apy * 100}%</Text>
          </Animated.View>
        )}
      </View>

      {/* Tokenização + Borrow DeFi */}
      <View style={styles.balancePanel}>
        <Text style={styles.balanceLabel}>Tokenizar Recebível e Liberar Liquidez</Text>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: theme.colors.accentCyan, marginTop: 8, opacity: borrowLoading ? 0.7 : 1 }]}
          onPress={onTokenizeAndBorrow}
          disabled={borrowLoading}
        >
          {borrowLoading ? (
            <ActivityIndicator color={theme.colors.text} />
          ) : (
            <Text style={[styles.actionText, { color: theme.colors.text }]}>Tokenizar + Borrow</Text>
          )}
        </Pressable>
        {defiResult && (
          <Animated.View style={{ opacity: fadeBorrow, marginTop: 10 }}>
            <Text style={[styles.balanceSub, { color: theme.colors.text }]}>Token: {defiResult.token.token_id} • Status: {defiResult.borrow.status}</Text>
            <Text style={[styles.balanceSub, { color: theme.colors.text }]}>RLUSD liberado: {defiResult.borrow.loan_rlusd} • Sequência: {String(defiResult.borrow.sequence ?? '-')}</Text>
          </Animated.View>
        )}
      </View>

      {/* Botão Soft-POS */}
      <View style={styles.softposBox}>
        <Pressable style={styles.softposBtn} onPress={goToPos}>
          <Text style={styles.softposText}>Tocar para Iniciar Nova Venda (Soft-POS)</Text>
        </Pressable>
        <Text style={styles.softposHint}>Aceita PIX, Cartão (Parcelado) e Cripto | Liquidação via XRPL Escrow.</Text>
      </View>

      {/* Link para POS */}
      <Pressable style={styles.linkPos} onPress={goToPos}>
        <Text style={styles.linkPosText}>Ir para Soft-POS</Text>
      </Pressable>
    </ScrollView>
  )
}