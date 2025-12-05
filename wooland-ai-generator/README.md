# WooLanding AI Generator

A WordPress plugin that generates high-conversion landing pages for WooCommerce products using AI.

## Description

WooLanding AI Generator allows shop managers to create professional, conversion-optimized landing pages for their WooCommerce products with a single click. The plugin integrates seamlessly with WooCommerce and uses AI to generate compelling content tailored to each product.

## Features

- ✨ One-click landing page generation from the product edit screen
- 🤖 AI-powered content generation (mock service for MVP)
- 🎨 Pre-designed conversion-optimized templates
- 🔗 Automatic integration with WooCommerce add-to-cart functionality
- 📝 Creates pages as drafts for review before publishing
- 🔐 Security-first design with nonces and capability checks

## Requirements

- **PHP**: 8.0 or higher
- **WordPress**: 6.0 or higher
- **WooCommerce**: 8.0 or higher

## Installation

1. Upload the `wooland-ai-generator` folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Go to WooCommerce > AI Landing Generator to configure settings
4. Navigate to any product edit screen and look for the "AI Landing Generator" metabox

## Usage

### Step 1: Configure Settings

1. Go to **WooCommerce > AI Landing Generator** in the WordPress admin
2. Enter your API key (for future AI service integration)
3. Save settings

### Step 2: Generate Landing Page

1. Edit any WooCommerce product
2. Find the **"AI Landing Generator"** metabox in the sidebar (right column)
3. Click the **"Generate Landing Page"** button
4. Wait for the generation process to complete
5. Click the link to edit your new landing page
6. Review, customize, and publish

## Development Status

### ✅ Completed (Steps 1-2)

- Plugin skeleton and main architecture
- Settings page with API key configuration
- WooCommerce product metabox UI
- JavaScript and AJAX handler
- Security implementation (nonces, capability checks)

### 🚧 In Progress (Steps 3-6)

- Core generator logic with product data fetching
- Mock AI service integration
- Template processing engine
- WordPress page creation functionality
- Error handling and validation

## File Structure

```
wooland-ai-generator/
├── assets/
│   ├── css/
│   │   └── admin.css           # Admin styles
│   └── js/
│       └── admin.js            # Admin JavaScript
├── includes/
│   ├── class-wlag-plugin.php   # Main plugin class
│   ├── class-wlag-settings.php # Settings page handler
│   ├── class-wlag-metabox.php  # Metabox UI handler
│   └── class-wlag-generator.php # Landing page generator
├── templates/                   # HTML templates (coming soon)
├── wooland-ai-generator.php    # Main plugin file
└── README.md                   # This file
```

## Technical Details

### Class Structure

- **WLAG_Plugin**: Main plugin class (Singleton pattern)
- **WLAG_Settings**: Handles settings page and API configuration
- **WLAG_Metabox**: Manages product edit screen metabox
- **WLAG_Generator**: Core landing page generation logic

### Hooks & Filters

**Actions:**
- `plugins_loaded` - Initialize plugin (priority 20)
- `admin_menu` - Add settings page
- `add_meta_boxes` - Add product metabox
- `admin_enqueue_scripts` - Load admin assets
- `wp_ajax_wlag_generate_landing` - Handle AJAX generation request

### Security Features

- ✅ Nonce verification for all AJAX requests
- ✅ Capability checks (`manage_woocommerce`, `edit_products`)
- ✅ Input sanitization with `sanitize_text_field()`, `absint()`
- ✅ Output escaping with `esc_html()`, `esc_attr()`, `esc_url()`
- ✅ ABSPATH checks in all PHP files

### Database

**Post Meta:**
- `_wlag_landing_page_id` - Stores generated landing page ID for each product

**Options:**
- `wlag_api_key` - Stores API key for AI service

## Coding Standards

This plugin follows:
- WordPress Coding Standards
- PSR-12 PHP coding style
- Object-Oriented Programming principles
- Prefix `wlag_` for all functions and database entries

## Next Steps

### Step 3-4: Core Generator Logic

- Implement product data fetching from WooCommerce
- Create mock AI service response
- Build template processing engine

### Step 5-6: Page Creation

- Implement WordPress page creation
- Add meta linking back to products
- Complete error handling

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/adriandev-web/saaswp).

## License

GPL-2.0+

## Author

Adrian Dev Web

---

**Version**: 1.0.0 (MVP)
**Last Updated**: 2025-12-05
