# Critical Improvements Needed

## 🚨 High Priority (Must Fix)

### 1. Layout Shift Prevention
**Issue**: Token rows don't have fixed heights, causing Cumulative Layout Shift (CLS)

**Fix**: Add minimum heights to token rows
```tsx
// In TokenColumn.tsx, add min-height to token row buttons
className="... min-h-[120px] sm:min-h-[140px]"
```

**Impact**: Improves Lighthouse CLS score

### 2. Performance: Throttle Frequent Updates
**Issue**: `useTokenData.ts` line 127 updates every 1 second, which can cause performance issues

**Current Code**:
```tsx
}, 1000); // Update every second
```

**Recommended Fix**:
```tsx
// Throttle to 2-3 seconds or use requestAnimationFrame
}, 2000); // Update every 2 seconds
// OR use throttle utility from utils
```

**Impact**: Reduces unnecessary re-renders, improves performance

### 3. Missing Accessibility Features
**Issue**: No ARIA labels, keyboard navigation not fully tested

**Fixes Needed**:
- Add `aria-label` to sort buttons
- Add `role="button"` to clickable elements
- Ensure keyboard navigation works (Tab, Enter, Escape)
- Add focus indicators

**Example**:
```tsx
<button
  aria-label={`Sort by ${field}`}
  role="button"
  tabIndex={0}
  className="focus-visible:ring-2 focus-visible:ring-blue-500"
>
```

### 4. WebSocket Connection Status
**Issue**: No visual indicator when WebSocket disconnects

**Fix**: Add connection status indicator in UI
```tsx
// In Pulse.tsx, show connection status
{!isConnected && (
  <div className="fixed top-0 right-0 bg-yellow-500 text-black px-4 py-2">
    Reconnecting...
  </div>
)}
```

---

## ⚠️ Medium Priority (Should Fix)

### 5. Progressive Loading Enhancement
**Issue**: Progressive loading is simulated but not granular

**Current**: Single 500ms delay
**Recommended**: Show partial data as it arrives

**Fix**: Update `useTokenData.ts` to handle partial data
```tsx
// Instead of waiting for all tokens, show them as they arrive
const [partialTokens, setPartialTokens] = useState<Token[]>([]);

// In WebSocket handler, add tokens incrementally
useWebSocketEvent('initial_data', (tokens: Token[]) => {
  // Add tokens in batches
  tokens.forEach((token, index) => {
    setTimeout(() => {
      setPartialTokens(prev => [...prev, token]);
    }, index * 50); // Stagger by 50ms
  });
});
```

### 6. Bundle Size Optimization
**Issue**: No code splitting verification

**Fixes**:
- Verify dynamic imports for heavy components
- Check if all Radix UI components are tree-shakeable
- Consider lazy loading TokenModal

**Example**:
```tsx
const TokenModal = dynamic(() => import('./TokenModal'), {
  ssr: false,
});
```

### 7. Error Recovery UX
**Issue**: Error boundaries exist but recovery could be better

**Fix**: Add retry mechanisms and better error messages
```tsx
// In ErrorBoundary.tsx
<Button onClick={handleReset}>Try Again</Button>
// Add automatic retry with exponential backoff
```

### 8. Type Safety Improvements
**Issue**: Some `any` types or loose typing

**Fixes**:
- Use branded types for IDs: `type TokenId = string & { readonly brand: unique symbol }`
- Stricter type guards for WebSocket messages
- Remove any `as` type assertions where possible

---

## 📝 Low Priority (Nice to Have)

### 9. Performance Monitoring
**Add**: Performance metrics collection
```tsx
// Track render times
const renderStart = performance.now();
// ... render
const renderTime = performance.now() - renderStart;
if (renderTime > 16) console.warn('Slow render:', renderTime);
```

### 10. Enhanced Documentation
**Add**: 
- JSDoc comments for all public functions
- README with architecture overview
- Component usage examples

### 11. Testing
**Add**:
- Unit tests for utilities
- Integration tests for hooks
- E2E tests for critical flows

---

## ✅ Already Good (Keep These)

1. ✅ Memoization strategy (6 memoized components)
2. ✅ useMemo/useCallback usage (19 instances)
3. ✅ Atomic architecture structure
4. ✅ TypeScript strict mode
5. ✅ Error boundaries (both React and Next.js)
6. ✅ Shimmer animations
7. ✅ Smooth color transitions
8. ✅ Comprehensive type definitions

---

## 🎯 Quick Wins (Easy Fixes)

1. **Add min-heights to prevent layout shifts** (5 min)
2. **Throttle update interval** (2 min)
3. **Add ARIA labels** (10 min)
4. **Add connection status indicator** (15 min)

**Total time: ~30 minutes for significant improvements**

---

## 📊 Expected Impact

After implementing high-priority fixes:
- **Lighthouse Performance**: +5-10 points
- **Lighthouse Accessibility**: +10-15 points
- **CLS Score**: Should improve to < 0.1
- **User Experience**: Noticeably smoother

