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

### ✅ Completed (All Steps 1-6)

**Step 1-2: Plugin Foundation**
- Plugin skeleton and main architecture
- Settings page with API key configuration
- WooCommerce product metabox UI
- JavaScript and AJAX handler
- Security implementation (nonces, capability checks)

**Step 3-4: Core Generator Logic**
- Product data fetching from WooCommerce API
- Mock AI service with smart content generation
- Template processing engine with placeholder replacement
- Complete error handling and validation

**Step 5-6: Page Creation**
- WordPress page creation with `wp_insert_post()`
- Product-to-page meta linking
- Draft status for review workflow
- Success response with edit links

### 🎉 MVP Status: READY FOR TESTING

The plugin is now fully functional and ready to generate landing pages!

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
├── templates/
│   └── landing-page-template.html # HTML landing page template
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

## How It Works

### The Generation Process

1. **User clicks "Generate Landing Page"** in the product metabox
2. **Product data collection**: Fetches name, price, images, descriptions from WooCommerce
3. **AI content generation** (mocked): Creates headlines, benefits, CTAs, testimonials
4. **Template processing**: Replaces placeholders in HTML template with actual data
5. **Page creation**: Creates a WordPress page as draft with generated content
6. **Meta linking**: Connects landing page to product via post meta

### Mock AI Service

For this MVP, the AI service is simulated with smart placeholder generation:
- **Headlines**: 5 variations based on product name
- **Benefits**: Generated from price, category, product features
- **CTAs**: 6 variations (Get It Now, Buy Now, etc.)
- **Social proof**: Auto-generated testimonials
- Content randomization ensures variety between generations

### Template Structure

The landing page includes:
- **Hero section**: Headline, subheadline, product image, price, CTA
- **Benefits section**: 3 key benefits with checkmarks
- **Product details**: Description from WooCommerce
- **Testimonial section**: Social proof with 5-star rating
- **Final CTA**: Urgency messaging with buy button

All sections use WordPress Gutenberg blocks for easy editing.

## Future Enhancements

- Real AI API integration (OpenAI, Claude, etc.)
- Multiple template variations
- A/B testing functionality
- Analytics integration
- Custom CSS styling options
- Elementor/Divi template support
- Bulk generation for multiple products
- Landing page performance tracking

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/adriandev-web/saaswp).

## License

GPL-2.0+

## Author

Adrian Dev Web

---

**Version**: 1.0.0 (MVP)
**Last Updated**: 2025-12-05
