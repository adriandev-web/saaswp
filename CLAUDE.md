# CLAUDE.md - AI Assistant Guide for SaaSWP

## Project Overview

**SaaSWP** is a SaaS platform built on or integrating with WordPress. This document serves as a comprehensive guide for AI assistants working on this codebase.

## Repository Status

**Current State**: This is a fresh repository. The initial codebase structure is yet to be established.

## Project Architecture (To Be Established)

### Expected Technology Stack

Based on the project name and typical SaaS WordPress architectures:

- **Backend**: WordPress (PHP), potentially with REST API or GraphQL
- **Frontend**: Could be headless (React/Next.js/Vue) or traditional WordPress themes
- **Database**: MySQL/MariaDB (WordPress standard)
- **Authentication**: WordPress auth, potentially JWT for headless setup
- **Payment Integration**: Stripe/PayPal for SaaS subscriptions
- **Multi-tenancy**: Could be subdomain-based or path-based

### Recommended Directory Structure

```
/
├── .github/              # GitHub Actions workflows, issue templates
├── wp-content/           # WordPress content directory
│   ├── plugins/          # Custom plugins for SaaS functionality
│   │   └── saaswp-core/  # Main SaaS plugin
│   ├── themes/           # Custom theme(s)
│   └── mu-plugins/       # Must-use plugins
├── config/               # Configuration files
├── docker/               # Docker setup for local development
├── scripts/              # Deployment and utility scripts
├── tests/                # PHPUnit, integration tests
├── docs/                 # Documentation
├── .env.example          # Environment variables template
├── docker-compose.yml    # Local development environment
├── composer.json         # PHP dependencies
├── package.json          # Node.js dependencies (if applicable)
└── README.md             # Project documentation
```

## Development Workflows

### Branch Strategy

- **main/master**: Production-ready code
- **develop**: Integration branch for features
- **feature/[name]**: Feature development branches
- **claude/[session-id]**: AI assistant working branches (auto-generated)
- **hotfix/[name]**: Emergency fixes for production

### Commit Conventions

Follow Conventional Commits specification:

```
feat: add subscription management endpoint
fix: resolve payment webhook timeout issue
docs: update API documentation
refactor: simplify user provisioning logic
test: add integration tests for tenant creation
chore: update dependencies
```

### Pull Request Process

1. Create feature branch from `develop`
2. Implement changes with clear, focused commits
3. Write/update tests for new functionality
4. Update documentation as needed
5. Create PR with descriptive title and summary
6. Request review from team members
7. Address feedback and merge

## Code Conventions

### PHP (WordPress) Standards

- Follow [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)
- Use PSR-4 autoloading for custom classes
- Prefix all custom functions with `saaswp_`
- Use namespaces for plugin code: `SaaSWP\{Component}\{Class}`
- Always escape output: `esc_html()`, `esc_attr()`, `esc_url()`
- Validate and sanitize input: `sanitize_text_field()`, `wp_verify_nonce()`

```php
<?php
namespace SaaSWP\Subscriptions;

class SubscriptionManager {
    public function create_subscription( $user_id, $plan_id ) {
        // Validate inputs
        $user_id = absint( $user_id );
        $plan_id = sanitize_text_field( $plan_id );

        // Business logic here
    }
}
```

### JavaScript Standards

- Use ES6+ syntax
- Follow WordPress JavaScript standards for WordPress integration
- Use meaningful variable names: `subscriptionData` not `sd`
- Add JSDoc comments for functions
- Use async/await for asynchronous operations

### Database

- Use WordPress database abstraction layer (`$wpdb`)
- Always prepare queries: `$wpdb->prepare()`
- Use appropriate prefixes: `{$wpdb->prefix}saaswp_tablename`
- Create custom tables via `dbDelta()` in plugin activation

### Security Best Practices

1. **Always verify nonces** for form submissions
2. **Escape all output** based on context
3. **Sanitize all input** before processing
4. **Use prepared statements** for database queries
5. **Check user capabilities** before sensitive operations
6. **Never trust user input** - validate everything
7. **Use WordPress functions** instead of raw PHP when possible

```php
// Good
if ( ! current_user_can( 'manage_subscriptions' ) ) {
    wp_die( 'Unauthorized' );
}

check_ajax_referer( 'saaswp_subscription_nonce', 'security' );
$plan_id = sanitize_text_field( $_POST['plan_id'] );

// Bad
$plan_id = $_POST['plan_id']; // No sanitization
```

## Testing Strategy

### Unit Tests

- Use PHPUnit for PHP unit tests
- Test coverage goal: >80% for business logic
- Mock WordPress functions using Brain Monkey or WP_Mock

### Integration Tests

- Test WordPress plugin activation/deactivation
- Test database operations
- Test API endpoints
- Test user workflows

### Running Tests

```bash
# PHP tests
composer test

# JavaScript tests (if applicable)
npm test

# E2E tests
npm run test:e2e
```

## AI Assistant Guidelines

### When Making Changes

1. **Always read files before modifying** - Never propose changes to code you haven't seen
2. **Use appropriate WordPress functions** - Leverage WordPress APIs instead of reinventing
3. **Follow security best practices** - Security is paramount in SaaS applications
4. **Maintain backward compatibility** - Don't break existing functionality
5. **Update tests** - Add/update tests for any code changes
6. **Document as you go** - Update inline docs and CLAUDE.md if architecture changes

### Code Quality Checklist

Before committing, ensure:

- [ ] Code follows WordPress coding standards
- [ ] All inputs are validated and sanitized
- [ ] All outputs are properly escaped
- [ ] User permissions are checked
- [ ] Nonces are verified for state-changing operations
- [ ] Database queries use prepared statements
- [ ] Error handling is implemented
- [ ] Code is documented with clear comments
- [ ] Tests are written/updated
- [ ] No sensitive data (API keys, passwords) in code

### Common Pitfalls to Avoid

1. **SQL Injection**: Always use `$wpdb->prepare()`
2. **XSS**: Always escape output with appropriate functions
3. **CSRF**: Always verify nonces for forms and AJAX
4. **Direct File Access**: Add `defined( 'ABSPATH' ) || exit;` to all PHP files
5. **Hardcoded Values**: Use constants or options for configuration
6. **Missing Capability Checks**: Always verify user permissions
7. **Inefficient Queries**: Use WordPress caching, avoid queries in loops

### SaaS-Specific Considerations

1. **Multi-tenancy**: Ensure data isolation between customers
2. **Subscription Management**: Handle trials, upgrades, downgrades, cancellations
3. **Usage Tracking**: Monitor resource usage per tenant
4. **Billing**: Integrate payment gateway webhooks properly
5. **Provisioning**: Automate tenant creation and setup
6. **Limits**: Enforce plan-based limitations
7. **Notifications**: Send appropriate emails for subscription events

## WordPress Specific Patterns

### Plugin Structure

```php
<?php
/**
 * Plugin Name: SaaSWP Core
 * Plugin URI: https://github.com/adriandev-web/saaswp
 * Description: Core SaaS functionality for WordPress
 * Version: 1.0.0
 * Author: Adrian Dev Web
 * License: GPL-2.0+
 */

defined( 'ABSPATH' ) || exit;

// Define constants
define( 'SAASWP_VERSION', '1.0.0' );
define( 'SAASWP_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'SAASWP_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Autoloader
require_once SAASWP_PLUGIN_DIR . 'vendor/autoload.php';

// Initialize plugin
function saaswp_init() {
    SaaSWP\Plugin::instance();
}
add_action( 'plugins_loaded', 'saaswp_init' );
```

### Action and Filter Hooks

Document custom hooks for extensibility:

```php
// Action: Fired after subscription is created
do_action( 'saaswp_subscription_created', $subscription_id, $user_id );

// Filter: Modify subscription data before save
$subscription_data = apply_filters( 'saaswp_subscription_data', $data, $user_id );
```

### REST API Endpoints

```php
register_rest_route( 'saaswp/v1', '/subscriptions', [
    'methods'             => 'POST',
    'callback'            => [ $this, 'create_subscription' ],
    'permission_callback' => [ $this, 'check_permission' ],
    'args'                => [
        'plan_id' => [
            'required'          => true,
            'type'              => 'string',
            'sanitize_callback' => 'sanitize_text_field',
        ],
    ],
] );
```

## Environment Setup

### Local Development

1. Clone repository: `git clone [repo-url]`
2. Copy `.env.example` to `.env` and configure
3. Start Docker environment: `docker-compose up -d`
4. Install dependencies: `composer install && npm install`
5. Access WordPress: `http://localhost:8000`
6. Access database: `http://localhost:8080` (phpMyAdmin)

### Environment Variables

```bash
# WordPress
WP_ENV=development
WP_HOME=http://localhost:8000
WP_SITEURL=${WP_HOME}/wp

# Database
DB_NAME=saaswp
DB_USER=root
DB_PASSWORD=password
DB_HOST=db:3306

# SaaS Configuration
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## Deployment

### Production Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations executed
- [ ] Debug mode disabled (`WP_DEBUG = false`)
- [ ] SSL certificate installed
- [ ] Caching configured (Redis/Memcached)
- [ ] Backup system in place
- [ ] Monitoring and logging configured
- [ ] Security headers set
- [ ] Rate limiting enabled

### Deployment Process

```bash
# 1. Pull latest code
git pull origin main

# 2. Update dependencies
composer install --no-dev --optimize-autoloader

# 3. Run database migrations
wp saaswp migrate

# 4. Clear caches
wp cache flush

# 5. Test critical paths
wp saaswp health-check
```

## Troubleshooting

### Common Issues

1. **White Screen of Death**: Check error logs in `wp-content/debug.log`
2. **Database Errors**: Verify credentials, check table prefixes
3. **Plugin Conflicts**: Deactivate other plugins, test individually
4. **Permission Issues**: Verify file permissions (644 files, 755 directories)
5. **API Errors**: Check endpoint URLs, verify nonce and authentication

### Debug Mode

Enable in `wp-config.php`:

```php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );
define( 'SCRIPT_DEBUG', true );
```

## Resources

### WordPress Documentation

- [Plugin Developer Handbook](https://developer.wordpress.org/plugins/)
- [REST API Handbook](https://developer.wordpress.org/rest-api/)
- [Coding Standards](https://developer.wordpress.org/coding-standards/)
- [WordPress APIs](https://codex.wordpress.org/WordPress_APIs)

### SaaS Development

- [Stripe Documentation](https://stripe.com/docs)
- [Multi-tenancy Patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/multitenancy)
- [SaaS Metrics](https://www.saastr.com/saas-metrics/)

## Maintenance

### Regular Updates

- Update WordPress core monthly (or as security patches released)
- Update plugins and themes weekly
- Review and update dependencies quarterly
- Security audit semi-annually

### Monitoring

- Uptime monitoring (e.g., UptimeRobot, Pingdom)
- Error tracking (e.g., Sentry, Rollbar)
- Performance monitoring (e.g., New Relic, Scout APM)
- Log aggregation (e.g., ELK Stack, Datadog)

## Contributing

When contributing to this project:

1. Read this entire CLAUDE.md document
2. Set up local development environment
3. Create feature branch from `develop`
4. Make changes following coding standards
5. Write tests for new functionality
6. Update documentation as needed
7. Submit pull request with clear description

## Notes for AI Assistants

- This is a SaaS application - data isolation and security are critical
- WordPress has specific ways of doing things - always use WordPress APIs
- Multi-tenancy requires careful attention to data scoping
- Subscription and billing logic must be robust and tested
- Always consider scalability in design decisions
- When in doubt, refer to WordPress documentation
- Ask for clarification if project requirements are ambiguous

## Version History

- **v1.0.0** (2025-12-05): Initial CLAUDE.md created for fresh repository

---

**Last Updated**: 2025-12-05
**Maintained By**: AI Assistants and Development Team
**Repository**: adriandev-web/saaswp
