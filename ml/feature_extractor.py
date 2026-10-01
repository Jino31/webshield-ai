import re
import ipaddress
import tldextract
from urllib.parse import urlparse


def extract_features(url):

    # Add scheme if missing
    if not re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", url):
        url = "http://" + url

    parsed = urlparse(url)

    # Extract domain information
    extracted = tldextract.extract(url)

    domain = extracted.domain
    suffix = extracted.suffix
    subdomain = extracted.subdomain

    hostname = parsed.hostname or ""

    # ---------------------------------------------------------
    # URL length
    # ---------------------------------------------------------

    url_length = len(url)

    # ---------------------------------------------------------
    # Domain length
    # ---------------------------------------------------------

    domain_length = len(hostname)

    # ---------------------------------------------------------
    # IP address
    # ---------------------------------------------------------

    try:
        ipaddress.ip_address(hostname)
        is_domain_ip = 1
    except ValueError:
        is_domain_ip = 0

    # ---------------------------------------------------------
    # TLD
    # ---------------------------------------------------------

    tld_length = len(suffix)

    # ---------------------------------------------------------
    # Subdomains
    # ---------------------------------------------------------

    if subdomain:
        no_of_subdomain = len(subdomain.split("."))
    else:
        no_of_subdomain = 0

    # ---------------------------------------------------------
    # Obfuscation
    # ---------------------------------------------------------

    obfuscation_characters = sum(
        char in "%@"
        for char in url
    )

    has_obfuscation = int(
        obfuscation_characters > 0
    )

    obfuscation_ratio = (
        obfuscation_characters / url_length
        if url_length > 0
        else 0
    )

    # ---------------------------------------------------------
    # Letters
    # ---------------------------------------------------------

    no_of_letters = sum(
        char.isalpha()
        for char in url
    )

    letter_ratio = (
        no_of_letters / url_length
        if url_length > 0
        else 0
    )

    # ---------------------------------------------------------
    # Digits
    # ---------------------------------------------------------

    no_of_digits = sum(
        char.isdigit()
        for char in url
    )

    digit_ratio = (
        no_of_digits / url_length
        if url_length > 0
        else 0
    )

    # ---------------------------------------------------------
    # Special characters
    # ---------------------------------------------------------

    no_of_equals = url.count("=")

    no_of_qmark = url.count("?")

    no_of_ampersand = url.count("&")

    special_chars = set(
        "!@#$%^&*()_+-=[]{}|;:',.<>/?`~"
    )

    no_of_other_special = sum(
        char in special_chars
        for char in url
    )

    special_char_ratio = (
        no_of_other_special / url_length
        if url_length > 0
        else 0
    )

    # ---------------------------------------------------------
    # Character continuation rate
    # ---------------------------------------------------------

    if url_length > 1:

        continuation_count = 0

        for i in range(1, url_length):

            if (
                url[i].isalnum()
                and url[i - 1].isalnum()
            ):
                continuation_count += 1

        char_continuation_rate = (
            continuation_count /
            (url_length - 1)
        )

    else:
        char_continuation_rate = 0

    # ---------------------------------------------------------
    # HTTPS
    # ---------------------------------------------------------

    is_https = int(
        parsed.scheme.lower() == "https"
    )

    # ---------------------------------------------------------
    # Return EXACT training feature names
    # ---------------------------------------------------------

    return {

        "URLLength": url_length,

        "DomainLength": domain_length,

        "IsDomainIP": is_domain_ip,

        "CharContinuationRate":
            char_continuation_rate,

        "TLDLength":
            tld_length,

        "NoOfSubDomain":
            no_of_subdomain,

        "HasObfuscation":
            has_obfuscation,

        "NoOfObfuscatedChar":
            obfuscation_characters,

        "ObfuscationRatio":
            obfuscation_ratio,

        "NoOfLettersInURL":
            no_of_letters,

        "LetterRatioInURL":
            letter_ratio,

        "NoOfDegitsInURL":
            no_of_digits,

        "DegitRatioInURL":
            digit_ratio,

        "NoOfEqualsInURL":
            no_of_equals,

        "NoOfQMarkInURL":
            no_of_qmark,

        "NoOfAmpersandInURL":
            no_of_ampersand,

        "NoOfOtherSpecialCharsInURL":
            no_of_other_special,

        "SpacialCharRatioInURL":
            special_char_ratio,

        "IsHTTPS":
            is_https
    }