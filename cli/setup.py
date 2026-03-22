from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="oss-marketplace",
    version="1.0.0",
    author="OSS Marketplace Team",
    author_email="hello@oss-marketplace.dev",
    description="Match maintainers with perfect contributors",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/oss-marketplace/oss-marketplace",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Build Tools",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
    python_requires=">=3.9",
    install_requires=[
        "rich>=13.0.0",
        "requests>=2.31.0",
        "click>=8.1.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "pytest-cov>=4.0.0",
            "black>=23.0.0",
            "flake8>=6.0.0",
            "mypy>=1.0.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "oss-profile=oss_profile:main",
            "oss-match=oss_match:main",
            "oss-health=oss_health:main",
        ],
    },
    include_package_data=True,
    zip_safe=False,
)
