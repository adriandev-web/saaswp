<?php
/**
 * Metabox Class
 *
 * @package WooLanding_AI_Generator
 */

defined( 'ABSPATH' ) || exit;

/**
 * Handles the metabox on product edit screen
 */
class WLAG_Metabox {

    /**
     * Meta key for storing generated landing page ID
     */
    const META_KEY_LANDING_PAGE = '_wlag_landing_page_id';

    /**
     * Constructor
     */
    public function __construct() {
        add_action( 'add_meta_boxes', array( $this, 'add_metabox' ) );
    }

    /**
     * Add metabox to product edit screen
     */
    public function add_metabox() {
        add_meta_box(
            'wlag-generator-metabox',
            __( 'AI Landing Generator', 'wooland-ai-generator' ),
            array( $this, 'render_metabox' ),
            'product',
            'side',
            'high'
        );
    }

    /**
     * Render metabox content
     *
     * @param WP_Post $post Current post object.
     */
    public function render_metabox( $post ) {
        // Check user capabilities
        if ( ! current_user_can( 'edit_post', $post->ID ) ) {
            return;
        }

        // Get existing landing page if any
        $landing_page_id = get_post_meta( $post->ID, self::META_KEY_LANDING_PAGE, true );
        $landing_page_exists = false;
        $landing_page_url = '';

        if ( $landing_page_id ) {
            $landing_page = get_post( $landing_page_id );
            if ( $landing_page && 'trash' !== $landing_page->post_status ) {
                $landing_page_exists = true;
                $landing_page_url = get_edit_post_link( $landing_page_id );
            }
        }

        // Add nonce for security
        wp_nonce_field( 'wlag_metabox_nonce_action', 'wlag_metabox_nonce' );

        ?>
        <div class="wlag-metabox-content">
            <p class="wlag-description">
                <?php esc_html_e( 'Generate a high-conversion landing page for this product using AI.', 'wooland-ai-generator' ); ?>
            </p>

            <?php if ( $landing_page_exists ) : ?>
                <div class="wlag-existing-page" style="margin-bottom: 15px; padding: 10px; background: #f0f6fc; border-left: 3px solid #2271b1;">
                    <p style="margin: 0 0 8px 0;">
                        <strong><?php esc_html_e( 'Landing Page Created:', 'wooland-ai-generator' ); ?></strong>
                    </p>
                    <p style="margin: 0 0 8px 0;">
                        <a href="<?php echo esc_url( $landing_page_url ); ?>" target="_blank" class="button button-secondary">
                            <?php esc_html_e( 'Edit Landing Page', 'wooland-ai-generator' ); ?>
                        </a>
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #666;">
                        <?php esc_html_e( 'Click the button below to generate a new one.', 'wooland-ai-generator' ); ?>
                    </p>
                </div>
            <?php endif; ?>

            <button
                type="button"
                id="wlag-generate-btn"
                class="button button-primary button-large"
                style="width: 100%; margin-bottom: 10px;"
                data-product-id="<?php echo esc_attr( $post->ID ); ?>"
            >
                <span class="dashicons dashicons-awards" style="margin-top: 3px;"></span>
                <?php esc_html_e( 'Generate Landing Page', 'wooland-ai-generator' ); ?>
            </button>

            <div id="wlag-status-message" class="wlag-status-message" style="display: none;">
                <!-- Status messages will appear here -->
            </div>

            <div class="wlag-info" style="margin-top: 15px; padding: 10px; background: #f9f9f9; border-radius: 4px; font-size: 12px;">
                <p style="margin: 0 0 5px 0;">
                    <strong><?php esc_html_e( 'What happens:', 'wooland-ai-generator' ); ?></strong>
                </p>
                <ol style="margin: 0; padding-left: 20px;">
                    <li><?php esc_html_e( 'Product data is collected', 'wooland-ai-generator' ); ?></li>
                    <li><?php esc_html_e( 'AI generates content', 'wooland-ai-generator' ); ?></li>
                    <li><?php esc_html_e( 'Page is created as draft', 'wooland-ai-generator' ); ?></li>
                    <li><?php esc_html_e( 'You can edit and publish', 'wooland-ai-generator' ); ?></li>
                </ol>
            </div>
        </div>

        <style>
            .wlag-status-message {
                margin-top: 10px;
                padding: 10px;
                border-radius: 4px;
                font-size: 13px;
            }
            .wlag-status-message.loading {
                background: #f0f6fc;
                border-left: 3px solid #2271b1;
                color: #2271b1;
            }
            .wlag-status-message.success {
                background: #edfaef;
                border-left: 3px solid #00a32a;
                color: #00a32a;
            }
            .wlag-status-message.error {
                background: #fcf0f1;
                border-left: 3px solid #d63638;
                color: #d63638;
            }
            .wlag-metabox-content .dashicons {
                vertical-align: middle;
            }
            #wlag-generate-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        </style>
        <?php
    }

    /**
     * Save landing page ID to product meta
     *
     * @param int $product_id Product ID.
     * @param int $page_id Landing page ID.
     */
    public static function save_landing_page_id( $product_id, $page_id ) {
        update_post_meta( $product_id, self::META_KEY_LANDING_PAGE, absint( $page_id ) );
    }

    /**
     * Get landing page ID for product
     *
     * @param int $product_id Product ID.
     * @return int|false Landing page ID or false if not found.
     */
    public static function get_landing_page_id( $product_id ) {
        $page_id = get_post_meta( $product_id, self::META_KEY_LANDING_PAGE, true );
        return $page_id ? absint( $page_id ) : false;
    }

    /**
     * Delete landing page ID from product meta
     *
     * @param int $product_id Product ID.
     */
    public static function delete_landing_page_id( $product_id ) {
        delete_post_meta( $product_id, self::META_KEY_LANDING_PAGE );
    }
}
