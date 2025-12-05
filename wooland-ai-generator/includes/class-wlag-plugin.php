<?php
/**
 * Main Plugin Class
 *
 * @package WooLanding_AI_Generator
 */

defined( 'ABSPATH' ) || exit;

/**
 * Main plugin class - Singleton pattern
 */
class WLAG_Plugin {

    /**
     * Single instance of the class
     *
     * @var WLAG_Plugin
     */
    private static $instance = null;

    /**
     * Settings instance
     *
     * @var WLAG_Settings
     */
    public $settings;

    /**
     * Metabox instance
     *
     * @var WLAG_Metabox
     */
    public $metabox;

    /**
     * Generator instance
     *
     * @var WLAG_Generator
     */
    public $generator;

    /**
     * Get instance
     *
     * @return WLAG_Plugin
     */
    public static function instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        $this->init_hooks();
        $this->init_components();
    }

    /**
     * Initialize hooks
     */
    private function init_hooks() {
        add_action( 'init', array( $this, 'load_textdomain' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
    }

    /**
     * Initialize plugin components
     */
    private function init_components() {
        $this->settings  = new WLAG_Settings();
        $this->metabox   = new WLAG_Metabox();
        $this->generator = new WLAG_Generator();
    }

    /**
     * Load plugin textdomain for translations
     */
    public function load_textdomain() {
        load_plugin_textdomain(
            'wooland-ai-generator',
            false,
            dirname( WLAG_PLUGIN_BASENAME ) . '/languages'
        );
    }

    /**
     * Enqueue admin assets
     *
     * @param string $hook Current admin page hook.
     */
    public function enqueue_admin_assets( $hook ) {
        // Only load on product edit screen
        if ( 'post.php' !== $hook && 'post-new.php' !== $hook ) {
            return;
        }

        $screen = get_current_screen();
        if ( ! $screen || 'product' !== $screen->post_type ) {
            return;
        }

        // Enqueue styles
        wp_enqueue_style(
            'wlag-admin',
            WLAG_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            WLAG_VERSION
        );

        // Enqueue scripts
        wp_enqueue_script(
            'wlag-admin',
            WLAG_PLUGIN_URL . 'assets/js/admin.js',
            array( 'jquery' ),
            WLAG_VERSION,
            true
        );

        // Localize script with data
        wp_localize_script(
            'wlag-admin',
            'wlagData',
            array(
                'ajaxUrl'     => admin_url( 'admin-ajax.php' ),
                'nonce'       => wp_create_nonce( 'wlag_generate_landing' ),
                'postId'      => get_the_ID(),
                'strings'     => array(
                    'generating'    => __( 'Generating landing page...', 'wooland-ai-generator' ),
                    'success'       => __( 'Success!', 'wooland-ai-generator' ),
                    'error'         => __( 'Error:', 'wooland-ai-generator' ),
                    'editPage'      => __( 'Edit Landing Page', 'wooland-ai-generator' ),
                    'confirmRegenerate' => __( 'A landing page already exists for this product. Generate a new one?', 'wooland-ai-generator' ),
                ),
            )
        );
    }

    /**
     * Get plugin version
     *
     * @return string
     */
    public function get_version() {
        return WLAG_VERSION;
    }

    /**
     * Prevent cloning
     */
    private function __clone() {}

    /**
     * Prevent unserializing
     */
    public function __wakeup() {
        throw new Exception( 'Cannot unserialize singleton' );
    }
}
