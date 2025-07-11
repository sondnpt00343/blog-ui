import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Card from "../../components/Card/Card";
import FallbackImage from "../../components/FallbackImage/FallbackImage";
import styles from "./EditProfile.module.scss";

const EditProfile = () => {
    const navigate = useNavigate();

    // Mock current user data - trong thực tế sẽ fetch từ API hoặc context
    const currentUser = {
        username: "john-doe",
        name: "John Doe",
        title: "Senior Frontend Developer",
        bio: "Passionate about modern web development, React ecosystem, and creating amazing user experiences.",
        avatar: "https://via.placeholder.com/120?text=JD",
        coverImage: "https://via.placeholder.com/1200x300?text=Cover+Image",
        location: "San Francisco, CA",
        website: "https://johndoe.dev",
        social: {
            twitter: "https://twitter.com/johndoe",
            github: "https://github.com/johndoe",
            linkedin: "https://linkedin.com/in/johndoe",
        },
        skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Docker"],
    };

    const [formData, setFormData] = useState({
        name: currentUser?.name || "",
        username: currentUser?.username || "",
        title: currentUser?.title || "",
        bio: currentUser?.bio || "",
        location: currentUser?.location || "",
        website: currentUser?.website || "",
        avatar: currentUser?.avatar || "",
        coverImage: currentUser?.coverImage || "",
        social: {
            twitter: currentUser?.social?.twitter || "",
            github: currentUser?.social?.github || "",
            linkedin: currentUser?.social?.linkedin || "",
        },
        skills: currentUser?.skills?.join(", ") || "",
        privacy: {
            profileVisibility: "public", // public, private
            showEmail: false,
            showFollowersCount: true,
            showFollowingCount: true,
            allowDirectMessages: true,
            showOnlineStatus: true,
        },
    });

    const [imageFiles, setImageFiles] = useState({
        avatar: null,
        coverImage: null,
    });

    const [imagePreviews, setImagePreviews] = useState({
        avatar: formData.avatar,
        coverImage: formData.coverImage,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field, value) => {
        if (field.startsWith("social.")) {
            const socialField = field.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                social: {
                    ...prev.social,
                    [socialField]: value,
                },
            }));
        } else if (field.startsWith("privacy.")) {
            const privacyField = field.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                privacy: {
                    ...prev.privacy,
                    [privacyField]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));
        }

        // Clear error for this field
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const handleImageChange = (type, event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setErrors((prev) => ({
                ...prev,
                [type]: "Please select a valid image file",
            }));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors((prev) => ({
                ...prev,
                [type]: "Image size must be less than 5MB",
            }));
            return;
        }

        // Clear previous error
        setErrors((prev) => ({
            ...prev,
            [type]: "",
        }));

        // Store file
        setImageFiles((prev) => ({
            ...prev,
            [type]: file,
        }));

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreviews((prev) => ({
                ...prev,
                [type]: e.target.result,
            }));
        };
        reader.readAsDataURL(file);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
            newErrors.username =
                "Username can only contain letters, numbers, hyphens and underscores";
        }

        if (formData.website && !formData.website.startsWith("http")) {
            newErrors.website =
                "Website URL must start with http:// or https://";
        }

        if (
            formData.social.twitter &&
            !formData.social.twitter.startsWith("https://twitter.com/")
        ) {
            newErrors["social.twitter"] =
                "Twitter URL must be a valid Twitter profile URL";
        }

        if (
            formData.social.github &&
            !formData.social.github.startsWith("https://github.com/")
        ) {
            newErrors["social.github"] =
                "GitHub URL must be a valid GitHub profile URL";
        }

        if (
            formData.social.linkedin &&
            !formData.social.linkedin.startsWith("https://linkedin.com/")
        ) {
            newErrors["social.linkedin"] =
                "LinkedIn URL must be a valid LinkedIn profile URL";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const uploadImages = async () => {
        const uploadedUrls = { ...imagePreviews };

        // Upload avatar if new file selected
        if (imageFiles.avatar) {
            // Simulate upload - in real app, upload to your storage service
            console.log("Uploading avatar:", imageFiles.avatar);
            // uploadedUrls.avatar = await uploadToStorage(imageFiles.avatar);
        }

        // Upload cover image if new file selected
        if (imageFiles.coverImage) {
            // Simulate upload - in real app, upload to your storage service
            console.log("Uploading cover image:", imageFiles.coverImage);
            // uploadedUrls.coverImage = await uploadToStorage(imageFiles.coverImage);
        }

        return uploadedUrls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Upload images first
            const imageUrls = await uploadImages();

            // Prepare data for submission
            const submitData = {
                ...formData,
                avatar: imageUrls.avatar,
                coverImage: imageUrls.coverImage,
                skills: formData.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter((skill) => skill.length > 0),
            };

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log("Profile updated successfully:", submitData);

            // Navigate back to profile with success message
            navigate(`/profile/${formData.username}`, {
                state: { message: "Profile updated successfully!" },
            });
        } catch (error) {
            console.error("Error saving profile:", error);
            setErrors({ submit: "Failed to save profile. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(-1); // Go back to previous page
    };

    return (
        <div className={styles.editProfilePage}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <Button
                        variant="ghost"
                        onClick={handleCancel}
                        className={styles.backButton}
                    >
                        ← Back
                    </Button>
                    <h1>Edit Profile</h1>
                    <p>Update your profile information and settings</p>
                </div>

                <Card className={styles.formCard}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Profile Images */}
                        <div className={styles.section}>
                            <h3>Profile Images</h3>
                            <div className={styles.imageSection}>
                                <div className={styles.imagePreview}>
                                    <div className={styles.coverPreview}>
                                        <FallbackImage
                                            src={imagePreviews.coverImage}
                                            alt="Cover preview"
                                            className={styles.coverImg}
                                        />
                                        <div className={styles.imageUpload}>
                                            <input
                                                type="file"
                                                id="coverImage"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleImageChange(
                                                        "coverImage",
                                                        e
                                                    )
                                                }
                                                className={styles.fileInput}
                                            />
                                            <label
                                                htmlFor="coverImage"
                                                className={styles.uploadButton}
                                            >
                                                📷 Change Cover
                                            </label>
                                        </div>
                                        <span className={styles.imageLabel}>
                                            Cover Image
                                        </span>
                                        {errors.coverImage && (
                                            <div className={styles.imageError}>
                                                {errors.coverImage}
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.avatarPreview}>
                                        <FallbackImage
                                            src={imagePreviews.avatar}
                                            alt="Avatar preview"
                                            className={styles.avatarImg}
                                        />
                                        <div className={styles.imageUpload}>
                                            <input
                                                type="file"
                                                id="avatar"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleImageChange(
                                                        "avatar",
                                                        e
                                                    )
                                                }
                                                className={styles.fileInput}
                                            />
                                            <label
                                                htmlFor="avatar"
                                                className={styles.uploadButton}
                                            >
                                                📷 Change
                                            </label>
                                        </div>
                                        <span className={styles.imageLabel}>
                                            Avatar
                                        </span>
                                        {errors.avatar && (
                                            <div className={styles.imageError}>
                                                {errors.avatar}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.imageHints}>
                                    <p>
                                        <strong>Avatar:</strong> Recommended
                                        400x400px, max 5MB
                                    </p>
                                    <p>
                                        <strong>Cover:</strong> Recommended
                                        1200x300px, max 5MB
                                    </p>
                                    <p>Supported formats: JPG, PNG, GIF</p>
                                </div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className={styles.section}>
                            <h3>Basic Information</h3>
                            <div className={styles.grid}>
                                <Input
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    error={errors.name}
                                    required
                                    fullWidth
                                />
                                <Input
                                    label="Username"
                                    value={formData.username}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "username",
                                            e.target.value
                                        )
                                    }
                                    error={errors.username}
                                    required
                                    fullWidth
                                />
                            </div>

                            <Input
                                label="Professional Title"
                                value={formData.title}
                                onChange={(e) =>
                                    handleInputChange("title", e.target.value)
                                }
                                placeholder="e.g. Senior Frontend Developer"
                                fullWidth
                            />

                            <div className={styles.textareaContainer}>
                                <label className={styles.textareaLabel}>
                                    Bio
                                </label>
                                <textarea
                                    className={styles.textarea}
                                    value={formData.bio}
                                    onChange={(e) =>
                                        handleInputChange("bio", e.target.value)
                                    }
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                />
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className={styles.section}>
                            <h3>Contact Information</h3>
                            <div className={styles.grid}>
                                <Input
                                    label="Location"
                                    value={formData.location}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "location",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. San Francisco, CA"
                                    fullWidth
                                />
                                <Input
                                    label="Website"
                                    value={formData.website}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "website",
                                            e.target.value
                                        )
                                    }
                                    placeholder="https://yourwebsite.com"
                                    error={errors.website}
                                    fullWidth
                                />
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className={styles.section}>
                            <h3>Social Links</h3>
                            <Input
                                label="Twitter"
                                value={formData.social.twitter}
                                onChange={(e) =>
                                    handleInputChange(
                                        "social.twitter",
                                        e.target.value
                                    )
                                }
                                placeholder="https://twitter.com/username"
                                error={errors["social.twitter"]}
                                fullWidth
                            />
                            <Input
                                label="GitHub"
                                value={formData.social.github}
                                onChange={(e) =>
                                    handleInputChange(
                                        "social.github",
                                        e.target.value
                                    )
                                }
                                placeholder="https://github.com/username"
                                error={errors["social.github"]}
                                fullWidth
                            />
                            <Input
                                label="LinkedIn"
                                value={formData.social.linkedin}
                                onChange={(e) =>
                                    handleInputChange(
                                        "social.linkedin",
                                        e.target.value
                                    )
                                }
                                placeholder="https://linkedin.com/in/username"
                                error={errors["social.linkedin"]}
                                fullWidth
                            />
                        </div>

                        {/* Skills */}
                        <div className={styles.section}>
                            <h3>Skills</h3>
                            <Input
                                label="Skills (comma separated)"
                                value={formData.skills}
                                onChange={(e) =>
                                    handleInputChange("skills", e.target.value)
                                }
                                placeholder="React, TypeScript, Node.js, GraphQL"
                                helperText="Separate skills with commas"
                                fullWidth
                            />
                        </div>

                        {/* Privacy Settings */}
                        <div className={styles.section}>
                            <h3>Privacy Settings</h3>
                            <div className={styles.privacyControls}>
                                <div className={styles.privacyItem}>
                                    <div className={styles.privacyInfo}>
                                        <label className={styles.privacyLabel}>
                                            Profile Visibility
                                        </label>
                                        <p
                                            className={
                                                styles.privacyDescription
                                            }
                                        >
                                            Control who can view your profile
                                        </p>
                                    </div>
                                    <select
                                        value={
                                            formData.privacy.profileVisibility
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                "privacy.profileVisibility",
                                                e.target.value
                                            )
                                        }
                                        className={styles.privacySelect}
                                    >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>

                                <div className={styles.privacyItem}>
                                    <div className={styles.privacyInfo}>
                                        <label className={styles.privacyLabel}>
                                            Show Email Address
                                        </label>
                                        <p
                                            className={
                                                styles.privacyDescription
                                            }
                                        >
                                            Display your email on your profile
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.privacy.showEmail}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "privacy.showEmail",
                                                e.target.checked
                                            )
                                        }
                                        className={styles.privacyToggle}
                                    />
                                </div>

                                <div className={styles.privacyItem}>
                                    <div className={styles.privacyInfo}>
                                        <label className={styles.privacyLabel}>
                                            Show Followers Count
                                        </label>
                                        <p
                                            className={
                                                styles.privacyDescription
                                            }
                                        >
                                            Display number of followers on your
                                            profile
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={
                                            formData.privacy.showFollowersCount
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                "privacy.showFollowersCount",
                                                e.target.checked
                                            )
                                        }
                                        className={styles.privacyToggle}
                                    />
                                </div>

                                <div className={styles.privacyItem}>
                                    <div className={styles.privacyInfo}>
                                        <label className={styles.privacyLabel}>
                                            Show Following Count
                                        </label>
                                        <p
                                            className={
                                                styles.privacyDescription
                                            }
                                        >
                                            Display number of people you follow
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={
                                            formData.privacy.showFollowingCount
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                "privacy.showFollowingCount",
                                                e.target.checked
                                            )
                                        }
                                        className={styles.privacyToggle}
                                    />
                                </div>

                                <div className={styles.privacyItem}>
                                    <div className={styles.privacyInfo}>
                                        <label className={styles.privacyLabel}>
                                            Allow Direct Messages
                                        </label>
                                        <p
                                            className={
                                                styles.privacyDescription
                                            }
                                        >
                                            Let other users send you direct
                                            messages
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={
                                            formData.privacy.allowDirectMessages
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                "privacy.allowDirectMessages",
                                                e.target.checked
                                            )
                                        }
                                        className={styles.privacyToggle}
                                    />
                                </div>

                                <div className={styles.privacyItem}>
                                    <div className={styles.privacyInfo}>
                                        <label className={styles.privacyLabel}>
                                            Show Online Status
                                        </label>
                                        <p
                                            className={
                                                styles.privacyDescription
                                            }
                                        >
                                            Display when you are online to other
                                            users
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={
                                            formData.privacy.showOnlineStatus
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                "privacy.showOnlineStatus",
                                                e.target.checked
                                            )
                                        }
                                        className={styles.privacyToggle}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className={styles.actions}>
                            {errors.submit && (
                                <div className={styles.submitError}>
                                    {errors.submit}
                                </div>
                            )}
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleCancel}
                                disabled={loading}
                                size="lg"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                                size="lg"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default EditProfile;
