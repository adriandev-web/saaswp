<?php
/**
 * Generator Class
 *
 * @package WooLanding_AI_Generator
 */

defined( 'ABSPATH' ) || exit;

/**
 * Handles landing page generation logic
 */
class WLAG_Generator {

    /**
     * Constructor
     */
    public function __construct() {
        // AJAX handler will be implemented in Step 3
        add_action( 'wp_ajax_wlag_generate_landing', array( $this, 'handle_ajax_generate' ) );
    }

    /**
     * Handle AJAX request for landing page generation
     */
    public function handle_ajax_generate() {
        // Verify nonce
        check_ajax_referer( 'wlag_generate_landing', 'nonce' );

        // Check user capabilities
        if ( ! current_user_can( 'edit_products' ) ) {
            wp_send_json_error(
                array(
                    'message' => __( 'You do not have permission to generate landing pages.', 'wooland-ai-generator' ),
                )
            );
        }

        // Get product ID
        $product_id = isset( $_POST['product_id'] ) ? absint( $_POST['product_id'] ) : 0;

        if ( ! $product_id ) {
            wp_send_json_error(
                array(
                    'message' => __( 'Invalid product ID.', 'wooland-ai-generator' ),
                )
            );
        }

        // Verify product exists
        $product = wc_get_product( $product_id );
        if ( ! $product ) {
            wp_send_json_error(
                array(
                    'message' => __( 'Product not found.', 'wooland-ai-generator' ),
                )
            );
        }

        try {
            // Step 4.1: Fetch product data
            $product_data = $this->fetch_product_data( $product );

            // Step 4.2: Get AI response (mocked for MVP)
            $ai_data = $this->mock_ai_response( $product_data );

            // Step 4.3: Process template with data
            $content = $this->process_template( $product_data, $ai_data );

            // Step 5: Create landing page
            $page_title = sprintf(
                /* translators: %s: Product name */
                __( 'Landing Page for %s', 'wooland-ai-generator' ),
                $product->get_name()
            );

            $page_id = $this->create_landing_page( $product_id, $content, $page_title );

            if ( is_wp_error( $page_id ) ) {
                wp_send_json_error(
                    array(
                        'message' => $page_id->get_error_message(),
                    )
                );
            }

            // Step 6: Return success response
            wp_send_json_success(
                array(
                    'message'  => __( 'Landing page created successfully!', 'wooland-ai-generator' ),
                    'page_id'  => $page_id,
                    'edit_url' => get_edit_post_link( $page_id, 'raw' ),
                    'view_url' => get_permalink( $page_id ),
                )
            );

        } catch ( Exception $e ) {
            wp_send_json_error(
                array(
                    'message' => sprintf(
                        /* translators: %s: Error message */
                        __( 'Error generating landing page: %s', 'wooland-ai-generator' ),
                        $e->getMessage()
                    ),
                )
            );
        }
    }

    /**
     * Fetch product data from WooCommerce
     *
     * @param WC_Product $product Product object.
     * @return array Product data.
     */
    private function fetch_product_data( $product ) {
        $product_id = $product->get_id();

        // Get product image
        $image_id  = $product->get_image_id();
        $image_url = '';
        if ( $image_id ) {
            $image_url = wp_get_attachment_image_url( $image_id, 'full' );
        }

        // Get prices
        $regular_price = $product->get_regular_price();
        $sale_price    = $product->get_sale_price();
        $display_price = $product->get_price();

        // Format prices for display
        $formatted_price = wc_price( $display_price );
        $has_sale        = ! empty( $sale_price ) && $sale_price < $regular_price;

        // Get add to cart URL
        $add_to_cart_url = add_query_arg(
            array(
                'add-to-cart' => $product_id,
            ),
            wc_get_checkout_url()
        );

        // Get product categories
        $categories = wp_get_post_terms( $product_id, 'product_cat', array( 'fields' => 'names' ) );
        $category   = ! empty( $categories ) && ! is_wp_error( $categories ) ? $categories[0] : '';

        return array(
            'id'               => $product_id,
            'name'             => $product->get_name(),
            'price'            => $display_price,
            'regular_price'    => $regular_price,
            'sale_price'       => $sale_price,
            'formatted_price'  => $formatted_price,
            'has_sale'         => $has_sale,
            'currency_symbol'  => get_woocommerce_currency_symbol(),
            'image_url'        => $image_url,
            'short_description' => $product->get_short_description(),
            'description'      => $product->get_description(),
            'add_to_cart_url'  => $add_to_cart_url,
            'permalink'        => $product->get_permalink(),
            'sku'              => $product->get_sku(),
            'category'         => $category,
            'stock_status'     => $product->get_stock_status(),
            'is_in_stock'      => $product->is_in_stock(),
        );
    }

    /**
     * Mock AI service response (simulates external AI API)
     *
     * @param array $product_data Product data.
     * @return array AI response data.
     */
    private function mock_ai_response( $product_data ) {
        // In production, this would call an external AI service
        // For MVP, we generate smart placeholder content based on product data

        $product_name = $product_data['name'];
        $price        = $product_data['formatted_price'];
        $category     = ! empty( $product_data['category'] ) ? $product_data['category'] : 'product';

        // Generate headline variations
        $headlines = array(
            sprintf( 'Discover the Power of %s', $product_name ),
            sprintf( 'Transform Your Life with %s', $product_name ),
            sprintf( 'Experience Excellence: %s', $product_name ),
            sprintf( 'Unleash Your Potential with %s', $product_name ),
            sprintf( 'The Ultimate %s Solution', $product_name ),
        );

        // Generate benefit statements
        $benefits = array(
            sprintf( 'Premium quality %s for only %s', strtolower( $category ), $price ),
            sprintf( 'Get professional results with %s', $product_name ),
            sprintf( 'Join thousands of satisfied customers who chose %s', $product_name ),
            'Fast and secure checkout process',
            'Backed by our satisfaction guarantee',
        );

        // Generate CTA variations
        $cta_variations = array(
            'Get It Now',
            'Buy Now',
            'Add to Cart',
            'Order Today',
            'Start Your Journey',
            'Claim Your Discount',
        );

        // Generate subheadline
        $subheadlines = array(
            sprintf( 'Experience the difference that %s makes', $product_name ),
            'Limited time offer - Don\'t miss out!',
            'Premium quality at an unbeatable price',
            sprintf( 'Join the %s revolution today', strtolower( $category ) ),
        );

        // Select random variations for variety
        $selected_headline    = $headlines[ array_rand( $headlines ) ];
        $selected_subheadline = $subheadlines[ array_rand( $subheadlines ) ];
        $selected_cta         = $cta_variations[ array_rand( $cta_variations ) ];

        // Pick 3 random benefits
        shuffle( $benefits );
        $selected_benefits = array_slice( $benefits, 0, 3 );

        // Generate social proof
        $testimonial = array(
            'quote'  => sprintf( 'This %s exceeded all my expectations. Highly recommended!', strtolower( $category ) ),
            'author' => 'Verified Customer',
            'rating' => 5,
        );

        return array(
            'headline'     => $selected_headline,
            'subheadline'  => $selected_subheadline,
            'benefit_1'    => $selected_benefits[0],
            'benefit_2'    => $selected_benefits[1],
            'benefit_3'    => $selected_benefits[2],
            'cta_text'     => $selected_cta,
            'testimonial'  => $testimonial,
            'urgency_text' => 'Limited stock available - Order now!',
        );
    }

    /**
     * Process template with data - replace placeholders with actual content
     *
     * @param array $product_data Product data.
     * @param array $ai_data AI generated data.
     * @return string Processed HTML.
     */
    private function process_template( $product_data, $ai_data ) {
        // Load template file
        $template_path = WLAG_PLUGIN_DIR . 'templates/landing-page-template.html';

        if ( ! file_exists( $template_path ) ) {
            throw new Exception( __( 'Template file not found.', 'wooland-ai-generator' ) );
        }

        $template = file_get_contents( $template_path );

        // Prepare product image block
        $product_image_block = '';
        if ( ! empty( $product_data['image_url'] ) ) {
            $product_image_block = sprintf(
                '<!-- wp:image {"align":"center","sizeSlug":"large"} -->
                <div class="wp-block-image"><figure class="aligncenter size-large">
                    <img src="%s" alt="%s" style="max-width: 600px; height: auto; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);"/>
                </figure></div>
                <!-- /wp:image -->',
                esc_url( $product_data['image_url'] ),
                esc_attr( $product_data['name'] )
            );
        }

        // Prepare price display
        $price_display = $product_data['formatted_price'];

        // Prepare sale badge
        $sale_badge = '';
        if ( $product_data['has_sale'] ) {
            $regular_formatted = wc_price( $product_data['regular_price'] );
            $sale_badge = sprintf(
                '<div style="text-align: center; margin-top: 10px;">
                    <span style="text-decoration: line-through; color: #666; font-size: 24px;">%s</span>
                    <span style="background: #00a32a; color: white; padding: 5px 15px; border-radius: 20px; margin-left: 10px; font-weight: bold;">SALE!</span>
                </div>',
                $regular_formatted
            );
        }

        // Prepare product description
        $description = '';
        if ( ! empty( $product_data['short_description'] ) ) {
            $description = wpautop( $product_data['short_description'] );
        } elseif ( ! empty( $product_data['description'] ) ) {
            // Use first 300 characters of full description if no short description
            $desc_text = wp_strip_all_tags( $product_data['description'] );
            $desc_text = substr( $desc_text, 0, 300 ) . '...';
            $description = wpautop( $desc_text );
        } else {
            $description = wpautop( sprintf(
                /* translators: %s: Product name */
                __( 'Experience the quality and excellence of %s. Perfect for your needs.', 'wooland-ai-generator' ),
                $product_data['name']
            ) );
        }

        // Build replacements array
        $replacements = array(
            '{{headline}}'           => esc_html( $ai_data['headline'] ),
            '{{subheadline}}'        => esc_html( $ai_data['subheadline'] ),
            '{{product_name}}'       => esc_html( $product_data['name'] ),
            '{{product_image_block}}' => $product_image_block,
            '{{price_display}}'      => $price_display,
            '{{sale_badge}}'         => $sale_badge,
            '{{cta_text}}'           => esc_html( $ai_data['cta_text'] ),
            '{{cta_link}}'           => esc_url( $product_data['add_to_cart_url'] ),
            '{{benefit_1}}'          => esc_html( $ai_data['benefit_1'] ),
            '{{benefit_2}}'          => esc_html( $ai_data['benefit_2'] ),
            '{{benefit_3}}'          => esc_html( $ai_data['benefit_3'] ),
            '{{product_description}}' => $description,
            '{{testimonial_quote}}'  => esc_html( $ai_data['testimonial']['quote'] ),
            '{{testimonial_author}}' => esc_html( $ai_data['testimonial']['author'] ),
            '{{urgency_text}}'       => esc_html( $ai_data['urgency_text'] ),
        );

        // Replace all placeholders
        $processed_content = str_replace(
            array_keys( $replacements ),
            array_values( $replacements ),
            $template
        );

        return $processed_content;
    }

    /**
     * Create landing page as WordPress post
     *
     * @param int    $product_id Product ID.
     * @param string $content Page content.
     * @param string $title Page title.
     * @return int|WP_Error Page ID or error.
     */
    private function create_landing_page( $product_id, $content, $title ) {
        // Sanitize title
        $title = sanitize_text_field( $title );

        // Prepare page data
        $page_data = array(
            'post_title'   => $title,
            'post_content' => $content,
            'post_status'  => 'draft',
            'post_type'    => 'page',
            'post_author'  => get_current_user_id(),
            'meta_input'   => array(
                '_wlag_parent_product_id' => absint( $product_id ),
                '_wlag_generated_at'      => current_time( 'mysql' ),
            ),
        );

        // Insert the page
        $page_id = wp_insert_post( $page_data, true );

        // Check for errors
        if ( is_wp_error( $page_id ) ) {
            return $page_id;
        }

        // Save landing page ID to product meta
        WLAG_Metabox::save_landing_page_id( $product_id, $page_id );

        // Add a custom admin notice meta for the page editor
        update_post_meta(
            $page_id,
            '_wlag_notice',
            sprintf(
                /* translators: %s: Product edit URL */
                __( 'This landing page was auto-generated for a WooCommerce product. <a href="%s">Edit Product</a>', 'wooland-ai-generator' ),
                get_edit_post_link( $product_id )
            )
        );

        return $page_id;
    }
}
