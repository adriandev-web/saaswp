<?php
/**
 * Settings Page Class
 *
 * @package WooLanding_AI_Generator
 */

defined( 'ABSPATH' ) || exit;

/**
 * Handles plugin settings page
 */
class WLAG_Settings {

    /**
     * Option name for API key
     */
    const OPTION_API_KEY = 'wlag_api_key';

    /**
     * Constructor
     */
    public function __construct() {
        add_action( 'admin_menu', array( $this, 'add_settings_page' ), 99 );
        add_action( 'admin_init', array( $this, 'register_settings' ) );
    }

    /**
     * Add settings page under WooCommerce menu
     */
    public function add_settings_page() {
        add_submenu_page(
            'woocommerce',
            __( 'AI Landing Generator', 'wooland-ai-generator' ),
            __( 'AI Landing Generator', 'wooland-ai-generator' ),
            'manage_woocommerce',
            'wlag-settings',
            array( $this, 'render_settings_page' )
        );
    }

    /**
     * Register settings
     */
    public function register_settings() {
        register_setting(
            'wlag_settings_group',
            self::OPTION_API_KEY,
            array(
                'type'              => 'string',
                'sanitize_callback' => 'sanitize_text_field',
                'default'           => '',
            )
        );

        add_settings_section(
            'wlag_api_section',
            __( 'API Configuration', 'wooland-ai-generator' ),
            array( $this, 'render_api_section' ),
            'wlag-settings'
        );

        add_settings_field(
            'wlag_api_key_field',
            __( 'API Key', 'wooland-ai-generator' ),
            array( $this, 'render_api_key_field' ),
            'wlag-settings',
            'wlag_api_section'
        );
    }

    /**
     * Render settings page
     */
    public function render_settings_page() {
        // Check user capabilities
        if ( ! current_user_can( 'manage_woocommerce' ) ) {
            wp_die( esc_html__( 'You do not have sufficient permissions to access this page.', 'wooland-ai-generator' ) );
        }

        ?>
        <div class="wrap">
            <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

            <?php settings_errors(); ?>

            <form method="post" action="options.php">
                <?php
                settings_fields( 'wlag_settings_group' );
                do_settings_sections( 'wlag-settings' );
                submit_button();
                ?>
            </form>

            <div class="wlag-settings-info" style="max-width: 800px; margin-top: 30px; padding: 20px; background: #f9f9f9; border-left: 4px solid #2271b1;">
                <h2><?php esc_html_e( 'How to Use', 'wooland-ai-generator' ); ?></h2>
                <ol>
                    <li><?php esc_html_e( 'Enter your API key above (will be used for future AI service integration)', 'wooland-ai-generator' ); ?></li>
                    <li><?php esc_html_e( 'Go to any WooCommerce product edit page', 'wooland-ai-generator' ); ?></li>
                    <li><?php esc_html_e( 'Find the "AI Landing Generator" metabox in the sidebar', 'wooland-ai-generator' ); ?></li>
                    <li><?php esc_html_e( 'Click "Generate Landing Page" button', 'wooland-ai-generator' ); ?></li>
                    <li><?php esc_html_e( 'A new landing page will be created as a draft', 'wooland-ai-generator' ); ?></li>
                </ol>

                <h3><?php esc_html_e( 'Features', 'wooland-ai-generator' ); ?></h3>
                <ul>
                    <li><?php esc_html_e( 'Automatic landing page generation from product data', 'wooland-ai-generator' ); ?></li>
                    <li><?php esc_html_e( 'AI-powered content suggestions', 'wooland-ai-generator' ); ?></li>
                    <li><?php esc_html_e( 'Pre-designed conversion-optimized templates', 'wooland-ai-generator' ); ?></li>
                    <li><?php esc_html_e( 'One-click integration with WooCommerce', 'wooland-ai-generator' ); ?></li>
                </ul>
            </div>
        </div>
        <?php
    }

    /**
     * Render API section description
     */
    public function render_api_section() {
        ?>
        <p>
            <?php
            echo wp_kses_post(
                __( 'Configure your AI service API key. This will be used to connect to the external AI service for generating landing page content.', 'wooland-ai-generator' )
            );
            ?>
        </p>
        <p>
            <strong><?php esc_html_e( 'Note:', 'wooland-ai-generator' ); ?></strong>
            <?php esc_html_e( 'For MVP testing, the plugin uses a mock AI service. Real API integration coming soon.', 'wooland-ai-generator' ); ?>
        </p>
        <?php
    }

    /**
     * Render API key field
     */
    public function render_api_key_field() {
        $api_key = get_option( self::OPTION_API_KEY, '' );
        ?>
        <input
            type="text"
            id="<?php echo esc_attr( self::OPTION_API_KEY ); ?>"
            name="<?php echo esc_attr( self::OPTION_API_KEY ); ?>"
            value="<?php echo esc_attr( $api_key ); ?>"
            class="regular-text"
            placeholder="<?php esc_attr_e( 'sk-xxxxxxxxxxxxx', 'wooland-ai-generator' ); ?>"
        />
        <p class="description">
            <?php esc_html_e( 'Enter your API key from the AI service provider.', 'wooland-ai-generator' ); ?>
        </p>
        <?php
    }

    /**
     * Get API key
     *
     * @return string
     */
    public static function get_api_key() {
        return get_option( self::OPTION_API_KEY, '' );
    }

    /**
     * Check if API key is configured
     *
     * @return bool
     */
    public static function is_api_key_configured() {
        $api_key = self::get_api_key();
        return ! empty( $api_key );
    }
}
