# FullStory Privacy Masking Guide

## Overview

This guide explains how to properly mask sensitive data in FullStory to comply with GDPR, CCPA, and other privacy regulations.

## Privacy Classes

FullStory React Native supports the following privacy classes:

- **`fs-mask`**: Masks sensitive text (passwords, credit cards, SSN, etc.)
- **`fs-exclude`**: Completely excludes component from recording
- **`fs-unmask`**: Explicitly allows recording (overrides parent masking)

## Implementation

### Password Fields

Password inputs have been automatically masked using `fsClass="fs-mask"` on the container View in `CustomPasswordInput.js`.

**Example:**
```jsx
<View fsClass="fs-mask">
  <TextInput secureTextEntry={true} />
</View>
```

### Other Sensitive Fields

If you have other sensitive fields (credit cards, SSN, tokens, etc.), wrap them similarly:

```jsx
// Mask sensitive text input
<View fsClass="fs-mask">
  <CustomInput
    value={creditCardNumber}
    placeholder="Credit Card"
  />
</View>

// Or exclude entire sections
<View fsClass="fs-exclude">
  <Text>Sensitive Information</Text>
  <CustomInput value={ssn} />
</View>
```

### Components Already Masked

The following components have been updated to mask sensitive data:

1. **CustomPasswordInput** - All password fields are automatically masked
2. **CustomInput with secureTextEntry** - Should be wrapped in View with `fs-mask` if used for sensitive data

### Additional Fields to Review

Review and mask the following if they contain sensitive data:

- **Verification Codes**: Already handled in ResetPasswordScreen (verification code input)
- **API Tokens**: If displayed anywhere, mask them
- **Personal Information**: Phone numbers, addresses, etc. (if required by compliance)
- **Financial Information**: Account numbers, routing numbers, etc.

## Best Practices

1. **Mask by Default**: When in doubt, mask sensitive fields
2. **Test Masking**: Verify in FullStory dashboard that masked fields show as `[Masked]`
3. **Review Regularly**: Periodically audit screens for new sensitive fields
4. **Document**: Keep this guide updated as new sensitive fields are added

## Testing Privacy Masking

1. Build a production release (FullStory is disabled in development)
2. Record a session in FullStory
3. Navigate to screens with sensitive data
4. Verify in FullStory replay that sensitive fields are masked
5. Check that user identification works correctly
6. Verify anonymization on logout

## Compliance Checklist

- [x] Password fields masked
- [ ] Credit card fields masked (if applicable)
- [ ] SSN/ID fields masked (if applicable)
- [ ] API tokens masked (if displayed)
- [ ] User identification implemented
- [ ] User anonymization on logout
- [ ] Session anonymization on session expiry

## Resources

- [FullStory Privacy Documentation](https://help.fullstory.com/hc/en-us/articles/360020623574)
- [FullStory React Native Privacy Guide](https://developer.fullstory.com/mobile/react-native/fullcapture/add-class/)

