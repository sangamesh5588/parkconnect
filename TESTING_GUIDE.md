# 🧪 Host Flow Testing Guide

## Quick Test Scenarios

### ✅ Test 1: Fresh Host Signup
**Expected Flow**: Landing → Login → Onboarding → Approval

```bash
1. Navigate to http://localhost:8083/become-host
2. Click "Become a Host" button
3. Sign up with email or Google
4. Should redirect to /host/onboarding automatically
5. Fill Step 1 (Personal Details) → Click Continue
6. Fill Step 2 (Address) → Click Continue
7. Fill Step 3 (Payment) → Click Continue
8. Fill Step 4 (KYC) → Upload documents → Click "Complete Setup"
9. Should redirect to /host/onboarding/approval
10. Should see "Under Review" status
```

**✅ PASS IF**: Auto-redirects to onboarding, saves progress, reaches approval page

---

### ✅ Test 2: Prevent Re-access After Submit
**Expected**: Cannot return to onboarding once submitted

```bash
1. Complete Test 1 first (reach approval page)
2. In browser URL, manually type: http://localhost:8083/host/onboarding
3. Press Enter
```

**✅ PASS IF**: Immediately redirects back to `/host/onboarding/approval`
**❌ FAIL IF**: Shows onboarding form again

---

### ✅ Test 3: Simulate Admin Approval
**Expected**: Real-time auto-redirect to dashboard

```bash
# Terminal 1: Keep app running
npm run dev

# Terminal 2 or Supabase Dashboard: Run SQL
1. Get your user ID from Supabase Auth dashboard
2. Run this SQL:

UPDATE host_onboarding
SET kyc_status = 'approved',
    is_completed = true,
    completed_at = NOW()
WHERE user_id = 'paste-your-user-id-here';

3. Watch the approval page - should auto-update within 2 seconds
4. Should show "Application Approved! 🎉"
5. Should redirect to /host/dashboard
```

**✅ PASS IF**: Page updates instantly, auto-redirects to dashboard
**❌ FAIL IF**: Needs manual refresh or doesn't redirect

---

### ✅ Test 4: Logout Redirects to Landing
**Expected**: Always returns to /become-host

```bash
1. From dashboard (or any page), click Logout
2. Wait for redirect
```

**✅ PASS IF**: Redirects to `/become-host`
**❌ FAIL IF**: Goes to login page or stays on dashboard

---

### ✅ Test 5: Resume Partial Onboarding
**Expected**: Picks up where user left off

```bash
1. Start onboarding, complete only Step 1
2. Click browser back or close tab
3. Logout
4. Login again
5. Should redirect to /host/onboarding
6. Should start at Step 2 (not Step 1)
```

**✅ PASS IF**: Resumes at Step 2, Step 1 data is still there
**❌ FAIL IF**: Restarts at Step 1 or loses data

---

### ✅ Test 6: Approved Host Re-login
**Expected**: Goes straight to dashboard

```bash
1. Get user approved (Test 3)
2. Logout
3. Login again with same credentials
```

**✅ PASS IF**: Skips onboarding, goes directly to `/host/dashboard`
**❌ FAIL IF**: Shows onboarding or approval page again

---

### ✅ Test 7: Clicking "Become Host" When Already Host
**Expected**: Routes based on status

```bash
# Scenario A: Onboarding incomplete
1. User with partial onboarding logs in
2. Clicks "Become a Host" button on landing
3. Should go to /host/onboarding (resume)

# Scenario B: Approved host
1. Approved host logs in
2. Clicks "Become a Host" button
3. Should go to /host/dashboard (already approved)

# Scenario C: Pending approval
1. User submitted onboarding, waiting for approval
2. Clicks "Become a Host" button
3. Should go to /host/onboarding/approval
```

**✅ PASS IF**: Each scenario routes correctly based on status
**❌ FAIL IF**: Any scenario loops or shows wrong page

---

## 🔍 Debugging Tips

### Check Current Status
```javascript
// Open browser console
const { data: { user } } = await supabase.auth.getUser();
const { data } = await supabase
  .from('host_onboarding')
  .select('*')
  .eq('user_id', user.id)
  .single();
console.log('Current status:', data);
```

### Force Status Change
```sql
-- Reset to start over
UPDATE host_onboarding
SET is_completed = false,
    kyc_status = 'pending',
    current_step = 1
WHERE user_id = 'your-user-id';

-- Set to approved
UPDATE host_onboarding
SET kyc_status = 'approved',
    is_completed = true,
    completed_at = NOW()
WHERE user_id = 'your-user-id';

-- Set to rejected
UPDATE host_onboarding
SET kyc_status = 'rejected'
WHERE user_id = 'your-user-id';
```

### Clear Session & Start Fresh
```javascript
// Browser console
await supabase.auth.signOut();
localStorage.clear();
sessionStorage.clear();
window.location.href = '/become-host';
```

---

## 📊 Test Results Template

```
| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| 1. Fresh Signup | Redirect to onboarding | [Result] | ✅/❌ |
| 2. Prevent Re-access | Block onboarding after submit | [Result] | ✅/❌ |
| 3. Admin Approval | Auto-redirect to dashboard | [Result] | ✅/❌ |
| 4. Logout Redirect | Go to /become-host | [Result] | ✅/❌ |
| 5. Resume Partial | Continue from last step | [Result] | ✅/❌ |
| 6. Approved Re-login | Skip to dashboard | [Result] | ✅/❌ |
| 7. Become Host Button | Route based on status | [Result] | ✅/❌ |
```

---

## 🚨 Common Issues & Fixes

### Issue: Stuck on approval page after approval
**Fix**: Check real-time subscription is working
```javascript
// In approval page, check console for:
"Supabase Realtime: SUBSCRIBED to channel"
```

### Issue: Redirects to wrong page
**Fix**: Check `checkHostStatus()` return value
```javascript
// Add console.log in hostStatusCheck.ts
console.log('Status result:', { status, redirectTo });
```

### Issue: Lost onboarding data
**Fix**: Check Zustand store persistence
```javascript
// Browser console
console.log(localStorage.getItem('parkconnect-onboarding'));
```

### Issue: Can access onboarding after submit
**Fix**: Verify `canAccessOnboarding()` is checking correctly
```sql
-- Check database
SELECT user_id, is_completed, kyc_status
FROM host_onboarding
WHERE user_id = 'your-id';
```

---

## ✅ All Tests Passing = Production Ready!

When all 7 tests pass, your host flow is **100% production-ready** with:
- ✅ No loops
- ✅ No duplicate onboarding
- ✅ Proper state management
- ✅ Real-time updates
- ✅ Correct redirects everywhere

**Happy Testing!** 🎉
