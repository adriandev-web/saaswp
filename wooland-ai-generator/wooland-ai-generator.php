<?php
/**
 * Plugin Name: WooLanding AI Generator
 * Plugin URI: https://github.com/adriandev-web/saaswp
 * Description: Generate high-conversion landing pages for WooCommerce products using AI
 * Version: 1.0.0
 * Author: Adrian Dev Web
 * Author URI: https://github.com/adriandev-web
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: wooland-ai-generator
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 8.0
 * WC requires at least: 8.0
 * WC tested up to: 8.5
 */

defined( 'ABSPATH' ) || exit;

// Define plugin constants
define( 'WLAG_VERSION', '1.0.0' );
define( 'WLAG_PLUGIN_FILE', __FILE__ );
define( 'WLAG_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'WLAG_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'WLAG_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Check if WooCommerce is active
 */
function wlag_check_dependencies() {
    if ( ! class_exists( 'WooCommerce' ) ) {
        add_action( 'admin_notices', 'wlag_woocommerce_missing_notice' );
        return false;
    }
    return true;
}

/**
 * Display admin notice when WooCommerce is not active
 */
function wlag_woocommerce_missing_notice() {
    ?>
    <div class="notice notice-error">
        <p>
            <?php
            echo wp_kses_post(
                sprintf(
                    /* translators: %s: WooCommerce plugin link */
                    __( '<strong>WooLanding AI Generator</strong> requires WooCommerce to be installed and active. Please install %s first.', 'wooland-ai-generator' ),
                    '<a href="https://wordpress.org/plugins/woocommerce/" target="_blank">WooCommerce</a>'
                )
            );
            ?>
        </p>
    </div>
    <?php
}

/**
 * Initialize the plugin
 */
function wlag_init() {
    if ( ! wlag_check_dependencies() ) {
        return;
    }

    // Load plugin classes
    require_once WLAG_PLUGIN_DIR . 'includes/class-wlag-plugin.php';
    require_once WLAG_PLUGIN_DIR . 'includes/class-wlag-settings.php';
    require_once WLAG_PLUGIN_DIR . 'includes/class-wlag-metabox.php';
    require_once WLAG_PLUGIN_DIR . 'includes/class-wlag-generator.php';

    // Initialize plugin
    WLAG_Plugin::instance();
}
add_action( 'plugins_loaded', 'wlag_init', 20 );

/**
 * Plugin activation hook
 */
function wlag_activate() {
    // Check PHP version
    if ( version_compare( PHP_VERSION, '8.0', '<' ) ) {
        deactivate_plugins( plugin_basename( __FILE__ ) );
        wp_die(
            esc_html__( 'WooLanding AI Generator requires PHP 8.0 or higher.', 'wooland-ai-generator' )
        );
    }

    // Set default options
    if ( ! get_option( 'wlag_api_key' ) ) {
        update_option( 'wlag_api_key', '' );
    }
}
register_activation_hook( __FILE__, 'wlag_activate' );

/**
 * Plugin deactivation hook
 */
function wlag_deactivate() {
    // Clean up if needed
}
register_deactivation_hook( __FILE__, 'wlag_deactivate' );
