<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://blueblocs.io
 * @since      1.0.0
 *
 * @package    Blueblocs
 * @subpackage Blueblocs/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Blueblocs
 * @subpackage Blueblocs/admin
 * @author     blueblocs <donate@blueblocs.io>
 */
class Blueblocs_Admin
{

    /**
     * The ID of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $plugin_name    The ID of this plugin.
     */
    private $plugin_name;

    /**
     * The version of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $version    The current version of this plugin.
     */
    private $version;

    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     * @param      string    $plugin_name       The name of this plugin.
     * @param      string    $version    The version of this plugin.
     */
    public function __construct($plugin_name, $version)
    {

        $this->plugin_name = $plugin_name;
        $this->version = $version;

    }

    /**
     * Register the stylesheets for the admin area.
     *
     * @since    1.0.0
     */
    public function enqueue_styles()
    {

        /**
         * This function is provided for demonstration purposes only.
         *
         * An instance of this class should be passed to the run() function
         * defined in Blueblocs_Loader as all of the hooks are defined
         * in that particular class.
         *
         * The Blueblocs_Loader will then create the relationship
         * between the defined hooks and the functions defined in this
         * class.
         */

        $current_page = get_current_screen();

        if (isset($current_page->base) && $current_page->base === "toplevel_page_blueblocs") {
            wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . '../dist/css/admin.css', array(), '', 'all');
        }

    }

    /**
     * Register the JavaScript for the admin area.
     *
     * @since    1.0.0
     */
    public function enqueue_scripts()
    {

        /**
         * This function is provided for demonstration purposes only.
         *
         * An instance of this class should be passed to the run() function
         * defined in Blueblocs_Loader as all of the hooks are defined
         * in that particular class.
         *
         * The Blueblocs_Loader will then create the relationship
         * between the defined hooks and the functions defined in this
         * class.
         */

        $current_page = get_current_screen();

        if (isset($current_page->base) && $current_page->base === "toplevel_page_blueblocs") {
            wp_enqueue_media();

            wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . '../dist/js/admin.js', array(), $this->version, true);

            wp_localize_script($this->plugin_name, 'wpr_object', array(
                'api_nonce' => wp_create_nonce('wp_rest'),
                'api_url' => rest_url($this->plugin_name . '/v1/'),
                'admin_url' => 'admin.php?page=' . $this->plugin_name,
                'image_path' => plugin_dir_url(__FILE__) . '../dist/images',
            ));
        }
    }

    /**
     * Register the administration menu for this plugin into the WordPress Dashboard menu.
     *
     * @since    1.0.0
     */
    public function add_plugin_admin_menu()
    {
        /*
         * Add a settings page for this plugin to the Settings menu.
         */
        add_menu_page(
            __('Blueblocs', $this->plugin_name),
            __('Blueblocs', $this->plugin_name),
            'manage_options',
            $this->plugin_name,
            array($this, 'display_plugin_admin_page'),
            plugins_url('blueblocs/dist/images/icon.png'),
            10
        );
    }

    /**
     * Render the settings page for this plugin.
     *
     * @since    1.0.0
     */
    public function display_plugin_admin_page()
    {
        echo '<div id="blueblocs-admin"></div>';
    }

    /**
     * Disable all admin notices on plugin page
     *
     * @since    1.0.0
     */
    public function remove_update_notifications()
    {
        $current_page = get_current_screen();

        if (isset($current_page->base) && $current_page->base === "toplevel_page_blueblocs") {
            remove_all_actions('admin_notices');
            remove_all_actions('network_admin_notices');
        }
    }
}
