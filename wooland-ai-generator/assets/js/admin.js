/**
 * Admin JavaScript for WooLanding AI Generator
 *
 * @package WooLanding_AI_Generator
 */

(function($) {
    'use strict';

    /**
     * Landing Page Generator Handler
     */
    const WLAGGenerator = {
        /**
         * Initialize
         */
        init: function() {
            this.cacheDom();
            this.bindEvents();
        },

        /**
         * Cache DOM elements
         */
        cacheDom: function() {
            this.$button = $('#wlag-generate-btn');
            this.$statusMessage = $('#wlag-status-message');
        },

        /**
         * Bind events
         */
        bindEvents: function() {
            this.$button.on('click', this.handleGenerate.bind(this));
        },

        /**
         * Handle generate button click
         */
        handleGenerate: function(e) {
            e.preventDefault();

            // Check if already generating
            if (this.$button.prop('disabled')) {
                return;
            }

            // Get product ID
            const productId = this.$button.data('product-id');
            if (!productId) {
                this.showError(wlagData.strings.error + ' Invalid product ID');
                return;
            }

            // Check if landing page already exists
            const existingPage = $('.wlag-existing-page');
            if (existingPage.length > 0) {
                if (!confirm(wlagData.strings.confirmRegenerate)) {
                    return;
                }
            }

            // Start generation
            this.startGeneration(productId);
        },

        /**
         * Start landing page generation
         */
        startGeneration: function(productId) {
            // Disable button and show loading state
            this.setButtonState(true);
            this.showLoading();

            // Prepare AJAX data
            const data = {
                action: 'wlag_generate_landing',
                nonce: wlagData.nonce,
                product_id: productId
            };

            // Send AJAX request
            $.ajax({
                url: wlagData.ajaxUrl,
                type: 'POST',
                data: data,
                timeout: 30000, // 30 seconds timeout
            })
            .done(this.handleSuccess.bind(this))
            .fail(this.handleError.bind(this))
            .always(this.handleComplete.bind(this));
        },

        /**
         * Handle successful response
         */
        handleSuccess: function(response) {
            if (response.success && response.data) {
                // Show success message with link
                let message = wlagData.strings.success;

                if (response.data.edit_url) {
                    message += ' <a href="' + response.data.edit_url + '" target="_blank">' +
                               wlagData.strings.editPage + '</a>';
                } else if (response.data.message) {
                    message += ' ' + response.data.message;
                }

                this.showSuccess(message);

                // Reload page after 2 seconds to show the updated metabox
                if (response.data.edit_url) {
                    setTimeout(function() {
                        location.reload();
                    }, 2000);
                }
            } else {
                // Handle error response
                const errorMessage = response.data && response.data.message
                    ? response.data.message
                    : 'Unknown error occurred';
                this.showError(wlagData.strings.error + ' ' + errorMessage);
            }
        },

        /**
         * Handle AJAX error
         */
        handleError: function(jqXHR, textStatus, errorThrown) {
            let errorMessage = wlagData.strings.error + ' ';

            if (textStatus === 'timeout') {
                errorMessage += 'Request timed out. Please try again.';
            } else if (jqXHR.responseJSON && jqXHR.responseJSON.data && jqXHR.responseJSON.data.message) {
                errorMessage += jqXHR.responseJSON.data.message;
            } else if (errorThrown) {
                errorMessage += errorThrown;
            } else {
                errorMessage += 'Unknown error occurred. Please try again.';
            }

            this.showError(errorMessage);
        },

        /**
         * Handle AJAX complete (always runs)
         */
        handleComplete: function() {
            // Re-enable button after a short delay
            setTimeout(() => {
                this.setButtonState(false);
            }, 1000);
        },

        /**
         * Set button state (loading/normal)
         */
        setButtonState: function(isLoading) {
            if (isLoading) {
                this.$button.prop('disabled', true);
                this.$button.addClass('loading');
                this.$button.find('.dashicons').removeClass('dashicons-awards').addClass('dashicons-update');
            } else {
                this.$button.prop('disabled', false);
                this.$button.removeClass('loading');
                this.$button.find('.dashicons').removeClass('dashicons-update').addClass('dashicons-awards');
            }
        },

        /**
         * Show loading message
         */
        showLoading: function() {
            this.$statusMessage
                .removeClass('success error')
                .addClass('loading')
                .html(wlagData.strings.generating)
                .fadeIn(300);
        },

        /**
         * Show success message
         */
        showSuccess: function(message) {
            this.$statusMessage
                .removeClass('loading error')
                .addClass('success')
                .html(message)
                .fadeIn(300);
        },

        /**
         * Show error message
         */
        showError: function(message) {
            this.$statusMessage
                .removeClass('loading success')
                .addClass('error')
                .html(message)
                .fadeIn(300);
        }
    };

    /**
     * Initialize when document is ready
     */
    $(document).ready(function() {
        // Only initialize if the button exists
        if ($('#wlag-generate-btn').length > 0) {
            WLAGGenerator.init();
        }
    });

})(jQuery);
